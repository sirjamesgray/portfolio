import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyPassword, verifyEnvPassword, isRecruiterConfigured, createSessionToken, getSessionFromCookies } from "@/lib/recruiter-auth"
import { checkRateLimit, getClientIp } from "@/lib/ratelimit"

export async function POST(request: NextRequest) {
  try {
    // Rate limit password attempts: 5 per 15 minutes per IP.
    // Protects the PBKDF2 hash against distributed brute force.
    const clientIp = getClientIp(request)
    const rl = checkRateLimit(`recruiter-verify:${clientIp}`, 5, 15 * 60 * 1000)
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      )
    }

    if (!isRecruiterConfigured()) {
      return NextResponse.json(
        { error: "Recruiter access is not configured.", code: "not_configured" },
        { status: 503 }
      )
    }

    let body: { password?: unknown; name?: unknown; company?: unknown; message?: unknown }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 })
    }
    const { password, name, company, message } = body as {
      password: string
      name: string
      company?: string
      message?: string
    }

    if (!password || !name) {
      return NextResponse.json(
        { error: "Password and name are required" },
        { status: 400 }
      )
    }

    if (typeof password !== "string" || password.length > 200) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Optional env password (RECRUITER_PASSWORD). Used first, with no database call.
    if (verifyEnvPassword(password)) {
      const token = createSessionToken({
        password_id: "env",
        password_label: "Shared link",
        visitor_name: String(name).slice(0, 120),
        visitor_company: String(company || "").slice(0, 120),
        visitor_message: "",
      })
      const res = NextResponse.json({ success: true })
      res.cookies.set("recruiter_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
      })
      return res
    }

    const adminClient = createAdminClient()

    // Find active passwords
    const { data: passwords, error } = await adminClient
      .from("recruiter_passwords")
      .select("*")
      .eq("is_active", true)

    if (error) {
      console.error("Error fetching passwords:", error)
      return NextResponse.json(
        { error: "Recruiter access is unavailable right now. Try again later.", code: "unavailable" },
        { status: 503 }
      )
    }

    // Try each active password
    let matchedPassword = null
    for (const pw of passwords) {
      if (verifyPassword(password, pw.password_hash, pw.password_salt)) {
        matchedPassword = pw
        break
      }
    }

    if (!matchedPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      )
    }

    // Log the access
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null
    const userAgent = request.headers.get("user-agent") || null
    const referrer = request.headers.get("referer") || null

    await adminClient.from("recruiter_access_logs").insert({
      password_id: matchedPassword.id,
      visitor_name: name,
      visitor_company: company || null,
      visitor_message: message || null,
      ip_address: ip,
      user_agent: userAgent,
      referrer,
      last_active_at: new Date().toISOString(),
    })

    // Create session token
    const token = createSessionToken({
      password_id: matchedPassword.id,
      password_label: matchedPassword.label,
      visitor_name: name,
      visitor_company: company || "",
      visitor_message: message || "",
    })

    const response = NextResponse.json({
      success: true,
      session: {
        password_label: matchedPassword.label,
        visitor_name: name,
      },
    })

    // Set secure session cookie
    response.cookies.set("recruiter_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (err) {
    console.error("Recruiter verify error:", err)
    return NextResponse.json(
      { error: "Recruiter access is unavailable right now. Try again later.", code: "unavailable" },
      { status: 503 }
    )
  }
}