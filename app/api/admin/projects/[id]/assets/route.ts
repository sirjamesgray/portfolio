import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

type AssetType = "previous_site" | "reference_link" | "screenshot" | "image" | "document"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const adminSupabase = createAdminClient()

  // Get all assets for this project
  const { data: assets, error } = await adminSupabase
    .from("project_assets")
    .select("*")
    .eq("project_id", projectId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching assets:", error)
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 })
  }

  // Also get the previous_site_url from projects
  const { data: project } = await adminSupabase
    .from("projects")
    .select("previous_site_url")
    .eq("id", projectId)
    .single()

  return NextResponse.json({
    assets: assets || [],
    previousSiteUrl: project?.previous_site_url || null,
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { type, title, url, storagePath, thumbnailUrl, description } = body as {
    type: AssetType
    title?: string
    url?: string
    storagePath?: string
    thumbnailUrl?: string
    description?: string
  }

  if (!type) {
    return NextResponse.json({ error: "Type is required" }, { status: 400 })
  }

  const adminSupabase = createAdminClient()

  // Get current max display_order
  const { data: maxOrder } = await adminSupabase
    .from("project_assets")
    .select("display_order")
    .eq("project_id", projectId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single()

  const displayOrder = (maxOrder?.display_order || 0) + 1

  const { data: asset, error } = await adminSupabase
    .from("project_assets")
    .insert({
      project_id: projectId,
      type,
      title: title || null,
      url: url || null,
      storage_path: storagePath || null,
      thumbnail_url: thumbnailUrl || null,
      description: description || null,
      display_order: displayOrder,
      added_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating asset:", error)
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 })
  }

  return NextResponse.json({ asset })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { assetId, previousSiteUrl, ...updates } = body

  const adminSupabase = createAdminClient()

  // If updating previousSiteUrl, update the projects table
  if (previousSiteUrl !== undefined) {
    const { error } = await adminSupabase
      .from("projects")
      .update({ previous_site_url: previousSiteUrl || null })
      .eq("id", projectId)

    if (error) {
      console.error("Error updating previous site URL:", error)
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  // Otherwise update a specific asset
  if (!assetId) {
    return NextResponse.json({ error: "Asset ID required" }, { status: 400 })
  }

  const { error } = await adminSupabase
    .from("project_assets")
    .update(updates)
    .eq("id", assetId)
    .eq("project_id", projectId)

  if (error) {
    console.error("Error updating asset:", error)
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { assetId } = body

  if (!assetId) {
    return NextResponse.json({ error: "Asset ID required" }, { status: 400 })
  }

  const adminSupabase = createAdminClient()

  // Get the asset first to check if we need to delete from storage
  const { data: asset } = await adminSupabase
    .from("project_assets")
    .select("storage_path")
    .eq("id", assetId)
    .eq("project_id", projectId)
    .single()

  // Delete from storage if there's a storage_path
  if (asset?.storage_path) {
    await adminSupabase.storage
      .from("project-assets")
      .remove([asset.storage_path])
  }

  // Delete the asset record
  const { error } = await adminSupabase
    .from("project_assets")
    .delete()
    .eq("id", assetId)
    .eq("project_id", projectId)

  if (error) {
    console.error("Error deleting asset:", error)
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
