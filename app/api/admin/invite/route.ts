import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin, SITE_CONFIG } from "@/lib/constants"
import { resend, EMAIL_FROM } from "@/lib/email/resend"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { email, name, projectId, resendInvite } = body as {
    email: string
    name?: string
    projectId?: string
    resendInvite?: boolean
  }

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const adminSupabase = createAdminClient()
  const customerName = name || email.split("@")[0]

  // Check if user already exists
  const { data: existingUsers } = await adminSupabase.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  )

  // If user exists and has confirmed their email, just add them to project
  if (existingUser && existingUser.email_confirmed_at && !resendInvite) {
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

  // For new users or resending invites, generate a magic link
  const redirectUrl = projectId
    ? `${SITE_CONFIG.url}/dashboard/projects/${projectId}`
    : `${SITE_CONFIG.url}/dashboard`

  // Use generateLink to create a magic link (doesn't send email)
  const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
    type: existingUser ? "magiclink" : "invite",
    email,
    options: {
      data: {
        full_name: customerName,
        invited_by: user.email,
        invited_at: new Date().toISOString(),
      },
      redirectTo: redirectUrl,
    }
  })

  if (linkError || !linkData?.properties?.action_link) {
    console.error("Error generating link:", linkError)
    return NextResponse.json({ error: "Failed to generate invitation link" }, { status: 500 })
  }

  // Get project title for email if projectId provided
  let projectTitle = "your project"
  if (projectId) {
    const { data: project } = await adminSupabase
      .from("projects")
      .select("title, public_title")
      .eq("id", projectId)
      .single()

    if (project) {
      projectTitle = project.public_title || project.title || "your project"
    }
  }

  // Send custom invite email via Resend
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: resendInvite
        ? `Reminder: Access your project dashboard`
        : `You're invited to view ${projectTitle}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">Hey ${customerName.split(" ")[0]}!</h1>

          <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 16px;">
            ${resendInvite
              ? `Just a reminder - you have access to a project dashboard where you can track progress on ${projectTitle}.`
              : `I've set up a project dashboard for you where you can track progress, view quotes, and stay updated on ${projectTitle}.`
            }
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 24px;">
            Click the button below to access your dashboard. This link will sign you in automatically.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${linkData.properties.action_link}"
               style="display: inline-block; background-color: #059669; color: white; font-weight: 500; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 16px;">
              Access Your Dashboard
            </a>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin-top: 32px;">
            This link expires in 24 hours. If you need a new link, just let me know.
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-top: 24px;">
            Talk soon,<br/>
            <strong>Jamie</strong>
          </p>
        </div>
      `,
    })
    console.log(`Invite email sent to ${email}`)
  } catch (emailError) {
    console.error("Error sending invite email:", emailError)
    return NextResponse.json({ error: "Failed to send invitation email" }, { status: 500 })
  }

  // If projectId provided, set up project membership
  if (projectId && linkData.user) {
    await adminSupabase
      .from("project_members")
      .upsert({
        project_id: projectId,
        user_id: linkData.user.id,
        role: "owner",
        added_by: user.id,
      }, {
        onConflict: "project_id,user_id"
      })

    await adminSupabase
      .from("projects")
      .update({ user_id: linkData.user.id })
      .eq("id", projectId)

    await adminSupabase.from("activity_log").insert({
      project_id: projectId,
      action: resendInvite ? "invite_resent" : "customer_invited",
      details: {
        email,
        invited_by: user.email,
      },
    })
  }

  return NextResponse.json({
    success: true,
    message: resendInvite
      ? `Reminder sent to ${email}`
      : `Invitation sent to ${email}`,
    userId: linkData.user?.id
  })
}
