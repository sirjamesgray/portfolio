import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"
import { resend, EMAIL_FROM } from "@/lib/email/resend"

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
    await supabase.from("activity_logs").insert({
      project_id: project.id,
      activity_type: "consultation_scheduled",
      description: "Consultation scheduled for " + new Date(event.start_time).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
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
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">Hey ${invitee.name.split(" ")[0]}!</h1>

            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 16px;">
              Thanks for booking a consultation. I'm looking forward to chatting with you on <strong>${consultationDate}</strong>.
            </p>

            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 24px;">
              In the meantime, I've set up a project dashboard for you where you'll be able to track progress, view quotes, and communicate throughout our work together.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://jamiegray.net/login"
                 style="display: inline-block; background-color: #059669; color: white; font-weight: 500; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 16px;">
                Access Your Dashboard
              </a>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin-top: 32px;">
              Just sign in with the same email you used to book (${invitee.email}) and your project will be waiting for you.
            </p>

            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-top: 24px;">
              Talk soon,<br/>
              <strong>Jamie</strong>
            </p>
          </div>
        `,
      })
      console.log("Sent welcome email to " + invitee.email)
    } catch (emailError) {
      // Non-fatal - log but don't fail the webhook
      console.error("Error sending welcome email:", emailError)
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
