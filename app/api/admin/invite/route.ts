import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { email, name, projectId } = body as { email: string; name?: string; projectId?: string }

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const adminSupabase = createAdminClient()

  // Check if user already exists
  const { data: existingUsers } = await adminSupabase.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  )

  if (existingUser) {
    // User exists - if projectId provided, just add them to the project
    if (projectId) {
      const { error } = await adminSupabase
        .from("project_members")
        .upsert({
          project_id: projectId,
          user_id: existingUser.id,
          role: "owner",
          added_by: user.id,
        }, {
          onConflict: "project_id,user_id"
        })

      if (error) {
        console.error("Error adding to project:", error)
        return NextResponse.json({ error: "Failed to add to project" }, { status: 500 })
      }

      // Also update user_id on the project
      await adminSupabase
        .from("projects")
        .update({ user_id: existingUser.id })
        .eq("id", projectId)

      return NextResponse.json({
        success: true,
        message: "User already exists and was added to the project",
        userId: existingUser.id,
        alreadyExists: true
      })
    }

    return NextResponse.json({
      error: "User with this email already exists",
      userId: existingUser.id,
      alreadyExists: true
    }, { status: 400 })
  }

  // Generate a magic link for the new user
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jamiegray.net"
  const redirectUrl = projectId
    ? `${siteUrl}/dashboard/projects/${projectId}`
    : `${siteUrl}/dashboard`

  const { data: inviteData, error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(
    email,
    {
      data: {
        full_name: name || email.split("@")[0],
        invited_by: user.email,
        invited_at: new Date().toISOString(),
      },
      redirectTo: redirectUrl,
    }
  )

  if (inviteError) {
    console.error("Error inviting user:", inviteError)
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 })
  }

  // If projectId provided, create a placeholder entry that we'll update when they accept
  if (projectId && inviteData?.user) {
    // Add them to project_members
    await adminSupabase
      .from("project_members")
      .upsert({
        project_id: projectId,
        user_id: inviteData.user.id,
        role: "owner",
        added_by: user.id,
      }, {
        onConflict: "project_id,user_id"
      })

    // Update project user_id
    await adminSupabase
      .from("projects")
      .update({ user_id: inviteData.user.id })
      .eq("id", projectId)

    // Log activity
    await adminSupabase.from("activity_log").insert({
      project_id: projectId,
      action: "customer_invited",
      details: `${email} was invited to the project`,
    })
  }

  return NextResponse.json({
    success: true,
    message: `Invitation sent to ${email}`,
    userId: inviteData?.user?.id
  })
}
