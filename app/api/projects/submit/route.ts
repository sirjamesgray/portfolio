import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { resend, EMAIL_FROM } from "@/lib/email/resend"
import { ProjectSubmittedEmail } from "@/emails/project-submitted"
import { PROJECT_TYPES, SITE_CONFIG, ADMIN_EMAILS } from "@/lib/constants"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, projectType, budget, timeline, description, isLoggedIn } = body

    // Check for authenticated user if isLoggedIn flag is set
    let userId: string | null = null
    if (isLoggedIn) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        userId = user.id
      }
    }

    // Validate required fields
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      )
    }

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Project description is required" },
        { status: 400 }
      )
    }

    const adminSupabase = createAdminClient()

    // Check if contact already exists
    const { data: existingContact } = await adminSupabase
      .from("contacts")
      .select("id")
      .eq("email", email.toLowerCase())
      .single()

    let contactId = existingContact?.id

    if (!contactId) {
      // Create new contact
      const { data: newContact, error: contactError } = await adminSupabase
        .from("contacts")
        .insert({
          email: email.toLowerCase(),
          name: name || email.split("@")[0],
        })
        .select("id")
        .single()

      if (contactError) {
        console.error("Error creating contact:", contactError)
        return NextResponse.json(
          { error: "Failed to create contact" },
          { status: 500 }
        )
      }

      contactId = newContact.id
    }

    // Create the project
    // Note: We store the initial description as requirements (the collaborative field)
    // description field is for admin's internal summary
    const { data: project, error: projectError } = await adminSupabase
      .from("projects")
      .insert({
        contact_id: contactId,
        user_id: userId,
        project_type: projectType || "other",
        budget: budget || "not-sure",
        timeline: timeline || "flexible",
        requirements: description.trim(),
        requirements_updated_at: new Date().toISOString(),
        status: "consultation",
      })
      .select("id")
      .single()

    if (projectError) {
      console.error("Error creating project:", projectError)
      return NextResponse.json(
        { error: "Failed to create project" },
        { status: 500 }
      )
    }

    // Log activity
    await adminSupabase.from("activity_log").insert({
      project_id: project.id,
      action: "project_submitted",
      details: {
        source: "website_form",
        has_account: !!userId,
      },
    })

    // Send confirmation email to the customer
    const projectTypeName = PROJECT_TYPES[projectType as keyof typeof PROJECT_TYPES] || "Project"
    const customerName = name || email.split("@")[0]

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: `Thanks for your ${projectTypeName.toLowerCase()} request!`,
        react: ProjectSubmittedEmail({
          name: customerName,
          projectType: projectTypeName,
          loginUrl: `${SITE_CONFIG.url}/login`,
        }),
      })
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Error sending confirmation email:", emailError)
    }

    // Send admin notification
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: ADMIN_EMAILS[0],
        subject: `New ${projectTypeName} Request from ${customerName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">New Project Request</h1>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">Customer</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${customerName} (${email})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">Project Type</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${projectTypeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">Budget</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${budget || "Not specified"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">Timeline</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${timeline || "Flexible"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">Has Account</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${userId ? "Yes" : "No"}</td>
              </tr>
            </table>

            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Project Description</h3>
            <p style="font-size: 14px; line-height: 1.6; color: #374151; background: #f3f4f6; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${description.trim()}</p>

            <div style="text-align: center; margin-top: 32px;">
              <a href="${SITE_CONFIG.url}/dashboard/admin/projects/${project.id}"
                 style="display: inline-block; background-color: #059669; color: white; font-weight: 500; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 16px;">
                View Project
              </a>
            </div>
          </div>
        `,
      })
    } catch (adminEmailError) {
      console.error("Error sending admin notification:", adminEmailError)
    }

    return NextResponse.json({
      success: true,
      projectId: project.id,
    })
  } catch (error) {
    console.error("Error submitting project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
