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

    // Return the magic link URL directly
    return NextResponse.json({
      success: true,
      // The hashed_token can be used to construct the login URL
      loginUrl: data.properties?.action_link,
    })
  } catch (error) {
    console.error("Dev login error:", error)
    return NextResponse.json({ error: "Failed to generate login link" }, { status: 500 })
  }
}
