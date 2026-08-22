import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createAdminClient } from "@/lib/supabase/admin"
import { cookies } from "next/headers"

// DEV ONLY - This endpoint only works in development
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Dev only" }, { status: 403 })
  }

  if (process.env.ENABLE_DEV_LOGIN !== "true") {
    return NextResponse.json({ error: "Set ENABLE_DEV_LOGIN=true in .env.local" }, { status: 403 })
  }

  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

    const baseUrl = new URL(request.url).origin
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // 1. Generate magic link via admin API to get a one-time token
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${baseUrl}/auth/callback?next=/dashboard` },
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const actionLink = data.properties?.action_link
    if (!actionLink) return NextResponse.json({ error: "Failed to generate link" }, { status: 500 })

    const token = new URL(actionLink).searchParams.get("token")
    if (!token) return NextResponse.json({ error: "Failed to extract token" }, { status: 500 })

    // 2. Follow Supabase's verify flow server-side.
    //    GET /auth/v1/verify?token=...&type=magiclink triggers a 303 redirect
    //    with the session tokens (access_token + refresh_token) in the Location hash.
    //    We capture this server-side so the browser never visits Supabase's hosted page.
    const authApi = supabaseUrl.replace(/\/$/, '') + '/auth/v1'
    const verifyUrl = new URL(`${authApi}/verify`)
    verifyUrl.searchParams.set("token", token)
    verifyUrl.searchParams.set("type", "magiclink")
    verifyUrl.searchParams.set("redirect_to", `${baseUrl}/auth/callback?next=/dashboard`)

    const verifyRes = await fetch(verifyUrl.toString(), {
      method: "GET",
      headers: { "Apikey": anonKey },
      redirect: "manual",
    })

    const location = verifyRes.headers.get("location")
    if (!location) return NextResponse.json({ error: "No redirect from verify" }, { status: 500 })

    // Parse the hash fragment (access_token, refresh_token, etc.)
    const hash = location.split("#")[1]
    if (!hash) return NextResponse.json({ error: "No session in redirect" }, { status: 500 })

    const hashParams = new URLSearchParams(hash)
    const accessToken = hashParams.get("access_token")
    const refreshToken = hashParams.get("refresh_token")
    if (!accessToken || !refreshToken) return NextResponse.json({ error: "Missing tokens" }, { status: 500 })

    // 3. Set the session on the server client so it writes the session cookies
    const cookieStore = await cookies()
    const supabase = createServerClient(
      supabaseUrl,
      anonKey,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (sessionError) {
      console.error("setSession error:", sessionError)
      return NextResponse.json({ error: sessionError.message }, { status: 500 })
    }

    // 4. Return localhost dashboard URL with session cookies already set
    return NextResponse.json({
      success: true,
      loginUrl: `${baseUrl}/dashboard`,
    })
  } catch (error) {
    console.error("Dev login error:", error)
    return NextResponse.json({ error: "Failed to generate login link" }, { status: 500 })
  }
}