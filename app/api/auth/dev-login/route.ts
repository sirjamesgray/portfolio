import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

// DEV ONLY - This endpoint only works in development
export async function POST(request: Request) {
  // Safety check 1: Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Dev login is only available in development" },
      { status: 403 }
    )
  }

  // Safety check 2: Require explicit opt-in
  if (process.env.ENABLE_DEV_LOGIN !== "true") {
    return NextResponse.json(
      { error: "Dev login is not enabled. Set ENABLE_DEV_LOGIN=true in .env.local" },
      { status: 403 }
    )
  }

  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    // Build redirect URL from the actual request URL
    // In development: http://localhost:3103
    // In production: https://jamiegray.net
    const baseUrl = new URL(request.url).origin

    // Generate a magic link that we can return directly
    const { data, error } = await adminSupabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${baseUrl}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      console.error("Dev login error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Supabase admin.generateLink builds the action_link URL with the
    // Supabase project's configured Site URL as redirect_to, even when
    // options.redirectTo is set. Replace redirect_to with our actual
    // request origin so the magic link lands on localhost in dev.
    let loginUrl = data.properties?.action_link
    if (loginUrl) {
      loginUrl = loginUrl.replace(
        /redirect_to=[^&]+/,
        `redirect_to=${encodeURIComponent(`${baseUrl}/auth/callback?next=/dashboard`)}`
      )
    }

    return NextResponse.json({
      success: true,
      loginUrl,
    })
  } catch (error) {
    console.error("Dev login error:", error)
    return NextResponse.json({ error: "Failed to generate login link" }, { status: 500 })
  }
}
