import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"
import { resend, EMAIL_FROM } from "@/lib/email/resend"
import { SITE_CONFIG, ADMIN_EMAILS } from "@/lib/constants"
import { emailLogoHtml } from "@/emails/components"

// Initialize Supabase admin client for webhook operations
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// Verify Calendly webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  signingKey: string
): boolean {
  const hmac = crypto.createHmac("sha256", signingKey)
  hmac.update(payload)
  const expectedSignature = hmac.digest("hex")
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

type CalendlyEvent = {
  event: string
  payload: {
    event: {
      uri: string
      name: string
      start_time: string
      end_time: string
    }
    invitee: {
      uri: string
      name: string
      email: string
      timezone: string
      questions_and_answers?: Array<{
        question: string
        answer: string
      }>
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY

    // Get the raw body for signature verification
    const rawBody = await request.text()
    const body: CalendlyEvent = JSON.parse(rawBody)

    // Verify webhook signature if signing key is configured
    if (signingKey) {
      const signature = request.headers.get("Calendly-Webhook-Signature")
      if (!signature) {
        console.error("Missing Calendly webhook signature")
        return NextResponse.json({ error: "Missing signature" }, { status: 401 })
      }

      // Calendly signature format: t=timestamp,v1=signature
      const signatureParts = signature.split(",")
      const timestampPart = signatureParts.find((p) => p.startsWith("t="))
      const signaturePart = signatureParts.find((p) => p.startsWith("v1="))

      if (!timestampPart || !signaturePart) {
        console.error("Invalid signature format")
        return NextResponse.json({ error: "Invalid signature format" }, { status: 401 })
      }

      const timestamp = timestampPart.replace("t=", "")
      const sig = signaturePart.replace("v1=", "")

      // Verify the signature
      const signedPayload = timestamp + "." + rawBody
      if (!verifyWebhookSignature(signedPayload, sig, signingKey)) {
        console.error("Invalid webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    } else {
      console.warn("CALENDLY_WEBHOOK_SIGNING_KEY not configured - skipping signature verification")
    }

    // Only handle invitee.created events
    if (body.event !== "invitee.created") {
      return NextResponse.json({ message: "Event type ignored" })
    }

    const { invitee, event } = body.payload
    const supabase = getSupabaseAdmin()

    // Check if contact already exists
    const { data: existingContact } = await supabase
      .from("contacts")
      .select("id")
      .eq("email", invitee.email)
      .single()

    let contactId: string

    if (existingContact) {
      contactId = existingContact.id
      console.log("Found existing contact:", contactId)
    } else {
      // Create new contact
      const { data: newContact, error: contactError } = await supabase
        .from("contacts")
        .insert({
          name: invitee.name,
          email: invitee.email,
          source: "calendly",
        })
        .select("id")
        .single()

      if (contactError || !newContact) {
        console.error("Error creating contact:", contactError)
        return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
      }

      contactId = newContact.id
      console.log("Created new contact:", contactId)
    }

    // Extract project details from questions if available
    let projectType = "consultation"
    let description = "Consultation scheduled via Calendly for " + event.name

    if (invitee.questions_and_answers) {
      for (const qa of invitee.questions_and_answers) {
        const question = qa.question.toLowerCase()
        if (question.includes("project") || question.includes("type")) {
          projectType = qa.answer.toLowerCase().includes("web")
            ? "website"
            : qa.answer.toLowerCase().includes("app")
            ? "web_app"
            : qa.answer.toLowerCase().includes("mobile")
            ? "mobile_app"
            : qa.answer.toLowerCase().includes("design")
            ? "design"
            : "other"
        }
        if (question.includes("describe") || question.includes("about") || question.includes("details")) {
          description = qa.answer
        }
      }
    }

    // Create project in consultation status
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        contact_id: contactId,
        title: invitee.name + "'s Project",
        project_type: projectType,
        status: "consultation",
        description,
        consultation_scheduled_at: event.start_time,
        calendly_event_uri: event.uri,
        calendly_invitee_uri: invitee.uri,
      })
      .select("id")
      .single()

    if (projectError || !project) {
      console.error("Error creating project:", projectError)
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

    console.log("Created project " + project.id + " for contact " + contactId)

    // Log activity
    await supabase.from("activity_log").insert({
      project_id: project.id,
      action: "consultation_scheduled",
      details: {
        scheduled_for: event.start_time,
        source: "calendly",
        event_name: event.name,
      },
    })

    // Send welcome email with dashboard link
    const consultationDate = new Date(event.start_time).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    })

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: invitee.email,
        subject: "Your project dashboard is ready",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            ${emailLogoHtml}
            <div style="padding: 40px 40px 32px;">
              <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 24px; text-align: center;">Hey ${invitee.name.split(" ")[0]}!</h1>

              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px;">
                Thanks for booking a consultation. I'm looking forward to chatting with you on <strong>${consultationDate}</strong>.
              </p>

              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 24px;">
                In the meantime, I've set up a project dashboard for you where you'll be able to track progress, view quotes, and stay updated on your project.
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${SITE_CONFIG.url}/login"
                   style="display: inline-block; background-color: #10b981; color: white; font-weight: 600; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.4);">
                  Access Your Dashboard
                </a>
              </div>

              <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin: 32px 0 0; text-align: center;">
                Just sign in with the same email you used to book (${invitee.email}) and your project will be waiting for you.
              </p>
            </div>
            <div style="border-top: 1px solid #e4e4e7; padding: 24px 40px; text-align: center;">
              <p style="font-size: 15px; line-height: 24px; color: #52525b; margin: 0 0 8px;">Talk soon!</p>
              <p style="font-size: 16px; font-weight: 600; color: #18181b; margin: 0;">Jamie Gray</p>
              <p style="font-size: 13px; color: #71717a; margin: 4px 0 0;">Product Engineer</p>
            </div>
          </div>
        `,
      })
      console.log("Sent welcome email to " + invitee.email)
    } catch (emailError) {
      // Non-fatal - log but don't fail the webhook
      console.error("Error sending welcome email:", emailError)
    }

    // Send admin notification
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: ADMIN_EMAILS[0],
        subject: `New Consultation Booked: ${invitee.name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">New Consultation Scheduled</h1>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">Customer</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${invitee.name} (${invitee.email})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">Event</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${event.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">Date/Time</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${consultationDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">Timezone</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${invitee.timezone}</td>
              </tr>
            </table>

            ${description !== "Consultation scheduled via Calendly for " + event.name ? `
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Project Details</h3>
            <p style="font-size: 14px; line-height: 1.6; color: #374151; background: #f3f4f6; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${description}</p>
            ` : ""}

            <div style="text-align: center; margin-top: 32px;">
              <a href="${SITE_CONFIG.url}/dashboard/admin/projects/${project.id}"
                 style="display: inline-block; background-color: #10b981; color: white; font-weight: 600; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.4);">
                View Project
              </a>
            </div>
          </div>
        `,
      })
      console.log("Sent admin notification for Calendly booking")
    } catch (adminEmailError) {
      console.error("Error sending admin notification:", adminEmailError)
    }

    return NextResponse.json({
      success: true,
      contactId,
      projectId: project.id,
    })
  } catch (error) {
    console.error("Calendly webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Calendly may send GET requests to verify the endpoint
export async function GET() {
  return NextResponse.json({ status: "ok" })
}
