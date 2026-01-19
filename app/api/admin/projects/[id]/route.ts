import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

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

  const { data: project, error } = await adminSupabase
    .from("projects")
    .select(`
      id,
      title,
      status,
      project_type,
      price,
      amount_paid,
      end_date,
      github_url,
      vercel_url,
      meeting_time,
      notes,
      requirements,
      requirements_updated_at,
      requirements_updated_by,
      cancellation_reason,
      created_at,
      updated_at,
      user_id,
      customer_opted_out_of_landing_page,
      show_on_landing_page,
      show_in_design_systems_section,
      public_title,
      public_description,
      public_hero_image,
      public_industry,
      public_content_html,
      icon_url,
      public_live_url,
      show_live_link,
      public_design_system_url,
      show_design_system_link,
      public_brand_color,
      design_system_image_url,
      design_system_description,
      contacts (
        name,
        email,
        phone,
        company
      )
    `)
    .eq("id", projectId)
    .single()

  if (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  return NextResponse.json({ project })
}

// Whitelist of fields that can be updated via admin PATCH
const ALLOWED_PROJECT_FIELDS = [
  "title",
  "status",
  "project_type",
  "price",
  "notes",
  "requirements",
  "github_url",
  "vercel_url",
  "end_date",
  "meeting_time",
  "show_on_landing_page",
  "show_in_design_systems_section",
  "public_title",
  "public_description",
  "public_hero_image",
  "public_industry",
  "public_content_html",
  "icon_url",
  "public_live_url",
  "show_live_link",
  "public_design_system_url",
  "show_design_system_link",
  "public_brand_color",
  "design_system_image_url",
  "design_system_description",
  "customer_opted_out_of_landing_page",
] as const

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

  // Filter to only allowed fields (security: prevent arbitrary field updates)
  const updates: Record<string, unknown> = {}
  for (const key of ALLOWED_PROJECT_FIELDS) {
    if (key in body) {
      updates[key] = body[key]
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
  }

  const adminSupabase = createAdminClient()

  const { error } = await adminSupabase
    .from("projects")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)

  if (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
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

  const adminSupabase = createAdminClient()

  // Soft delete: set deleted_at timestamp instead of hard delete
  // This preserves data for audit trail and allows recovery
  const { error } = await adminSupabase
    .from("projects")
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: user.id,
    })
    .eq("id", projectId)

  if (error) {
    console.error("Error soft-deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }

  // Log the deletion
  await adminSupabase.from("activity_log").insert({
    project_id: projectId,
    action: "project_deleted",
    details: { deleted_by: user.email },
  })

  return NextResponse.json({ success: true })
}
