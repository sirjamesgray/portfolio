import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

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

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  const type = formData.get("type") as string || "image"
  const title = formData.get("title") as string || ""

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
  }

  // Limit file size to 10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
  }

  const adminSupabase = createAdminClient()

  // Generate unique filename
  const ext = file.name.split(".").pop()
  const filename = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await adminSupabase.storage
    .from("project-assets")
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error("Error uploading file:", uploadError)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }

  // Get public URL
  const { data: { publicUrl } } = adminSupabase.storage
    .from("project-assets")
    .getPublicUrl(filename)

  // Get current max display_order
  const { data: maxOrder } = await adminSupabase
    .from("project_assets")
    .select("display_order")
    .eq("project_id", projectId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single()

  const displayOrder = (maxOrder?.display_order || 0) + 1

  // Create asset record
  const { data: asset, error: assetError } = await adminSupabase
    .from("project_assets")
    .insert({
      project_id: projectId,
      type: type as "screenshot" | "image" | "document",
      title: title || file.name,
      url: publicUrl,
      storage_path: filename,
      display_order: displayOrder,
      added_by: user.id,
    })
    .select()
    .single()

  if (assetError) {
    console.error("Error creating asset record:", assetError)
    // Try to delete the uploaded file
    await adminSupabase.storage.from("project-assets").remove([filename])
    return NextResponse.json({ error: "Failed to create asset record" }, { status: 500 })
  }

  return NextResponse.json({ asset })
}
