import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

const BUCKET_NAME = "project-assets"

// GET - List all storage files and identify orphaned ones
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const adminClient = createAdminClient()

  try {
    // Get all files in storage (recursively)
    const allStorageFiles: string[] = []

    // List root folders first
    const { data: rootList, error: rootError } = await adminClient.storage
      .from(BUCKET_NAME)
      .list("", { limit: 1000 })

    if (rootError) {
      console.error("Error listing storage root:", rootError)
      return NextResponse.json({ error: "Failed to list storage" }, { status: 500 })
    }

    // For each folder/file at root, get contents recursively
    for (const item of rootList || []) {
      if (item.id === null) {
        // It's a folder - list its contents
        const { data: folderContents } = await adminClient.storage
          .from(BUCKET_NAME)
          .list(item.name, { limit: 1000 })

        for (const file of folderContents || []) {
          if (file.id !== null) {
            allStorageFiles.push(`${item.name}/${file.name}`)
          }
        }
      } else {
        // It's a file at root level
        allStorageFiles.push(item.name)
      }
    }

    // Get all referenced URLs from database tables
    const referencedPaths = new Set<string>()

    // 1. Check projects table for image URLs
    const { data: projects } = await adminClient
      .from("projects")
      .select("public_hero_image, icon_url, design_system_image_url")

    for (const project of projects || []) {
      for (const field of ["public_hero_image", "icon_url", "design_system_image_url"]) {
        const url = project[field as keyof typeof project]
        if (url && typeof url === "string") {
          const path = extractStoragePath(url)
          if (path) referencedPaths.add(path)
        }
      }
    }

    // 2. Check project_assets table
    const { data: assets } = await adminClient
      .from("project_assets")
      .select("storage_path, url")

    for (const asset of assets || []) {
      if (asset.storage_path) {
        referencedPaths.add(asset.storage_path)
      }
      if (asset.url) {
        const path = extractStoragePath(asset.url)
        if (path) referencedPaths.add(path)
      }
    }

    // Find orphaned files (in storage but not referenced)
    const orphanedFiles = allStorageFiles.filter(path => !referencedPaths.has(path))

    // Generate public URLs for orphaned files
    const orphanedWithUrls = orphanedFiles.map(path => {
      const { data: { publicUrl } } = adminClient.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path)
      return { path, url: publicUrl }
    })

    return NextResponse.json({
      totalFiles: allStorageFiles.length,
      referencedFiles: referencedPaths.size,
      orphanedFiles: orphanedWithUrls,
      orphanedCount: orphanedFiles.length,
    })
  } catch (error) {
    console.error("Storage cleanup error:", error)
    return NextResponse.json({ error: "Failed to analyze storage" }, { status: 500 })
  }
}

// DELETE - Delete specific orphaned files
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { paths } = body

  if (!paths || !Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json({ error: "No paths provided" }, { status: 400 })
  }

  const adminClient = createAdminClient()

  try {
    const { data, error } = await adminClient.storage
      .from(BUCKET_NAME)
      .remove(paths)

    if (error) {
      console.error("Error deleting files:", error)
      return NextResponse.json({ error: "Failed to delete files" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      deletedCount: paths.length,
      deleted: data,
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete files" }, { status: 500 })
  }
}

// Helper to extract storage path from Supabase URL
function extractStoragePath(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(new RegExp(`/storage/v1/object/public/${BUCKET_NAME}/(.+)$`))
    if (pathMatch) {
      return pathMatch[1]
    }
  } catch {
    // Not a valid URL
  }
  return null
}
