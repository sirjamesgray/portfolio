import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

type MemberRole = "admin" | "owner" | "viewer"

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

  // Get all members for this project
  const { data: members, error } = await adminSupabase
    .from("project_members")
    .select("id, user_id, role, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }

  // Get user details for each member
  const userIds = members?.map(m => m.user_id) || []
  const memberDetails = []

  for (const member of members || []) {
    const { data: userData } = await adminSupabase.auth.admin.getUserById(member.user_id)
    if (userData?.user) {
      memberDetails.push({
        ...member,
        user: {
          id: userData.user.id,
          email: userData.user.email,
          name: userData.user.user_metadata?.full_name || userData.user.email?.split("@")[0],
        }
      })
    }
  }

  // Also get assigned admin from projects table
  const { data: project } = await adminSupabase
    .from("projects")
    .select("assigned_admin_id")
    .eq("id", projectId)
    .single()

  let assignedAdmin = null
  if (project?.assigned_admin_id) {
    const { data: adminData } = await adminSupabase.auth.admin.getUserById(project.assigned_admin_id)
    if (adminData?.user) {
      assignedAdmin = {
        id: adminData.user.id,
        email: adminData.user.email,
        name: adminData.user.user_metadata?.full_name || adminData.user.email?.split("@")[0],
      }
    }
  }

  return NextResponse.json({
    members: memberDetails,
    assignedAdmin
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
  const { userId, role, email } = body as { userId?: string; role: MemberRole; email?: string }

  if (!role || !["admin", "owner", "viewer"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

  const adminSupabase = createAdminClient()

  // If email is provided instead of userId, look up the user
  let targetUserId = userId
  if (!targetUserId && email) {
    const { data: users } = await adminSupabase.auth.admin.listUsers()
    const foundUser = users?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())
    if (!foundUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    targetUserId = foundUser.id
  }

  if (!targetUserId) {
    return NextResponse.json({ error: "User ID or email required" }, { status: 400 })
  }

  // For admin role, update the assigned_admin_id on projects table
  if (role === "admin") {
    const { error } = await adminSupabase
      .from("projects")
      .update({ assigned_admin_id: targetUserId })
      .eq("id", projectId)

    if (error) {
      console.error("Error assigning admin:", error)
      return NextResponse.json({ error: "Failed to assign admin" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  // For owner/viewer, add to project_members table
  const { error } = await adminSupabase
    .from("project_members")
    .upsert({
      project_id: projectId,
      user_id: targetUserId,
      role,
      added_by: user.id,
    }, {
      onConflict: "project_id,user_id"
    })

  if (error) {
    console.error("Error adding member:", error)
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 })
  }

  // If setting a new owner, also update user_id on projects table for backward compatibility
  if (role === "owner") {
    await adminSupabase
      .from("projects")
      .update({ user_id: targetUserId })
      .eq("id", projectId)
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
  const { userId, role } = body as { userId: string; role: MemberRole }

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  const adminSupabase = createAdminClient()

  // If removing admin, clear assigned_admin_id
  if (role === "admin") {
    const { error } = await adminSupabase
      .from("projects")
      .update({ assigned_admin_id: null })
      .eq("id", projectId)
      .eq("assigned_admin_id", userId)

    if (error) {
      console.error("Error removing admin:", error)
      return NextResponse.json({ error: "Failed to remove admin" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  // For owner/viewer, remove from project_members
  const { error } = await adminSupabase
    .from("project_members")
    .delete()
    .eq("project_id", projectId)
    .eq("user_id", userId)

  if (error) {
    console.error("Error removing member:", error)
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 })
  }

  // If removing owner, also clear user_id on projects table
  if (role === "owner") {
    await adminSupabase
      .from("projects")
      .update({ user_id: null })
      .eq("id", projectId)
      .eq("user_id", userId)
  }

  return NextResponse.json({ success: true })
}
