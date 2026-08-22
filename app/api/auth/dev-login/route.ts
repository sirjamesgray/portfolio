import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createAdminClient } from "@/lib/supabase/admin"
import { cookies } from "next/headers"

// DEV ONLY - This endpoint only works in development
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Dev login is only available in development" },
      { status: 403 }
    )
  }

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

    const baseUrl = new URL(request.url).origin
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // 1. Generate magic link via admin API to get the token
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${baseUrl}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const actionLink = data.properties?.action_link
    if (!actionLink) {
      return NextResponse.json({ error: "Failed to generate link" }, { status: 500 })
    }

    // 2. Extract the token from the action link
    const token = new URL(actionLink).searchParams.get("token")
    if (!token) {
      return NextResponse.json({ error: "Failed to extract token" }, { status: 500 })
    }

    // 3. Follow the Supabase verify flow server-side to capture session tokens.
    //    GET the verify URL (triggers a 303 redirect), capture the Location header
    //    which contains the access_token + refresh_token in the hash fragment.
    const supabaseAuthApi = supabaseUrl.replace(/\/$/, '') + '/auth/v1'
    const verifyUrl = new URL(`${supabaseAuthApi}/verify`)
    verifyUrl.searchParams.set("token", token)
    verifyUrl.searchParams.set("type", "magiclink")
    verifyUrl.searchParams.set("redirect_to", `${baseUrl}/auth/callback?next=/dashboard`)

    const verifyRes = await fetch(verifyUrl.toString(), {
      method: "GET",
      headers: {
        "Apikey": anonKey,
      },
      redirect: "manual", // Don't follow the 303 redirect
    })

    // The 303 redirect Location header has the session info in the hash fragment
    const location = verifyRes.headers.get("location")
    if (!location) {
      return NextResponse.json({ error: "No redirect from Supabase verify" }, { status: 500 })
    }

    // Parse the hash fragment from the Location header
    const hashPart = location.split("#")[1]
    if (!hashPart) {
      return NextResponse.json({ error: "No session data in redirect" }, { status: 500 })
    }

    const params = new URLSearchParams(hashPart)
    const accessToken = params.get("access_token")
    const refreshToken = params.get("refresh_token")

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: "Missing tokens in redirect" }, { status: 500 })
    }

    // 4. Create a session client-side using the tokens
    //    We set the Supabase auth cookies manually
    const cookieStore = await cookies()
    const clientSupabase = createServerClient(
      supabaseUrl,
      anonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    // Set the session using the tokens we captured server-side
    const { error: sessionError } = await clientSupabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (sessionError) {
      console.error("Set session error:", sessionError)
      return NextResponse.json({ error: "Failed to set session" }, { status: 500 })
    }

    // Success — redirect to localhost dashboard with session cookies
    return NextResponse.json({
      success: true,
      loginUrl: `${baseUrl}/dashboard`,
    })
  } catch (error) {
    console.error("Dev login error:", error)
    return NextResponse.json({ error: "Failed to generate login link" }, { status: 500 })
  }
}