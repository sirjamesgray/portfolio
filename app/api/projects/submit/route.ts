import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { resend, EMAIL_FROM } from "@/lib/email/resend"
import { ProjectSubmittedEmail } from "@/emails/project-submitted"
import { PROJECT_TYPES, SITE_CONFIG } from "@/lib/constants"

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
