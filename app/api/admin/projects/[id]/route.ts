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
      public_title,
      public_description,
      public_hero_image,
      public_industry,
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
  const adminSupabase = createAdminClient()

  const { error } = await adminSupabase
    .from("projects")
    .update({
      ...body,
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

  // Hard delete the project (CASCADE will handle related records)
  const { error } = await adminSupabase
    .from("projects")
    .delete()
    .eq("id", projectId)

  if (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
