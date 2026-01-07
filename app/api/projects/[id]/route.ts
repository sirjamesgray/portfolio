import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, requirements, customer_opted_out_of_landing_page } = body

  // Build update object with only provided fields
  const updates: Record<string, unknown> = {}
  if (title !== undefined) updates.title = title
  if (description !== undefined) updates.description = description
  if (requirements !== undefined) {
    updates.requirements = requirements
    updates.requirements_updated_at = new Date().toISOString()
    updates.requirements_updated_by = user.id
  }
  if (customer_opted_out_of_landing_page !== undefined) {
    updates.customer_opted_out_of_landing_page = customer_opted_out_of_landing_page
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 })
  }

  const userIsAdmin = isAdmin(user.email)

  // For admins, use admin client to bypass RLS
  // For customers, use regular client which enforces RLS (user can only edit their own projects)
  const queryClient = userIsAdmin ? createAdminClient() : supabase

  // First verify the project exists (and for customers, that they own it)
  const { data: existingProject, error: fetchError } = await queryClient
    .from("projects")
    .select("id, user_id, requirements")
    .eq("id", id)
    .single()

  if (fetchError || !existingProject) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  // For non-admin users, verify they own the project
  if (!userIsAdmin && existingProject.user_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // If requirements are being updated, save the old version to history
  if (requirements !== undefined && existingProject.requirements) {
    const adminSupabase = createAdminClient()
    await adminSupabase.from("requirements_versions").insert({
      project_id: id,
      content: existingProject.requirements,
      updated_by: user.id,
      updated_by_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Unknown",
    })
  }

  // Update the project
  const { data: project, error } = await queryClient
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select("id, title, description, requirements, customer_opted_out_of_landing_page")
    .single()

  if (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }

  // Log activity for opt-out toggle
  if (customer_opted_out_of_landing_page !== undefined) {
    const adminSupabase = createAdminClient()
    const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer"
    await adminSupabase.from("activity_log").insert({
      project_id: id,
      action: customer_opted_out_of_landing_page ? "customer_opted_out" : "customer_opted_in",
      details: customer_opted_out_of_landing_page
        ? `${userName} opted out of landing page feature`
        : `${userName} removed opt-out (project may be featured)`,
    })
  }

  // Log activity for requirements update
  if (requirements !== undefined) {
    const adminSupabase = createAdminClient()
    const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
    await adminSupabase.from("activity_log").insert({
      project_id: id,
      action: "requirements_updated",
      details: `${userName} updated project requirements`,
    })
  }

  return NextResponse.json({ success: true, project })
}
