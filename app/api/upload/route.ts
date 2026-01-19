import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const BUCKET_NAME = "project-assets"

export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) {
    console.error("[upload/POST] Auth error:", authError.message)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }

  if (!user) {
    console.error("[upload/POST] No user found in session")
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  if (!isAdmin(user.email)) {
    console.error("[upload/POST] User is not admin:", user.email)
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const path = formData.get("path") as string || "images"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG" },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      )
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "png"
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const filename = `${path}/${timestamp}-${randomSuffix}.${ext}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload using admin client to bypass RLS
    const adminClient = createAdminClient()
    const { data, error } = await adminClient.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error("[upload/POST] Storage upload error:", error.message, error.cause)
      return NextResponse.json(
        { error: `Storage error: ${error.message}` },
        { status: 500 }
      )
    }

    console.log("[upload/POST] Successfully uploaded:", data.path)

    // Get public URL
    const { data: urlData } = adminClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return NextResponse.json({
      url: urlData.publicUrl,
      path: data.path,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// Delete an uploaded file
export async function DELETE(request: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json({ error: "No path provided" }, { status: 400 })
    }

    const adminClient = createAdminClient()
    const { error } = await adminClient.storage
      .from(BUCKET_NAME)
      .remove([path])

    if (error) {
      console.error("Storage delete error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to delete file" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
