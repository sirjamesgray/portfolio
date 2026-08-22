import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyPassword, createSessionToken, getSessionFromCookies } from "@/lib/recruiter-auth"

export async function POST(request: NextRequest) {
  try {
    const { password, name, company, message } = await request.json()

    if (!password || !name) {
      return NextResponse.json(
        { error: "Password and name are required" },
        { status: 400 }
      )
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
        { error: "Internal server error" },
        { status: 500 }
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
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (err) {
    console.error("Recruiter verify error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}