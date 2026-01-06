import { NextRequest, NextResponse } from "next/server"
import { render } from "@react-email/render"
import { MagicLinkEmail, WelcomeEmail, ProjectUpdateEmail, ProjectSubmittedEmail } from "@/emails"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { templateId, props } = await request.json()

    let html: string

    switch (templateId) {
      case "magic-link":
        html = await render(MagicLinkEmail(props as { magicLink: string; email: string }))
        break
      case "welcome":
        html = await render(WelcomeEmail(props as { name: string; dashboardUrl: string }))
        break
      case "project-update":
        html = await render(ProjectUpdateEmail(props as {
          name: string
          projectName: string
          updateMessage: string
          dashboardUrl: string
        }))
        break
      case "project-submitted":
        html = await render(ProjectSubmittedEmail(props as {
          name: string
          projectType: string
          loginUrl: string
        }))
        break
      default:
        return NextResponse.json({ error: "Unknown template" }, { status: 400 })
    }

    return NextResponse.json({ html })
  } catch (error) {
    console.error("Error rendering email:", error)
    return NextResponse.json({ error: "Failed to render email" }, { status: 500 })
  }
}
