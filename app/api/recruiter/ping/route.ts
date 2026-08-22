import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionFromCookies } from "@/lib/recruiter-auth"

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie")
    const session = getSessionFromCookies(cookieHeader)

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Update the most recent access log for this password to track session duration
    const adminClient = createAdminClient()

    const { data: latestLog } = await adminClient
      .from("recruiter_access_logs")
      .select("id")
      .eq("password_id", session.password_id)
      .eq("visitor_name", session.visitor_name)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (latestLog) {
      await adminClient
        .from("recruiter_access_logs")
        .update({ last_active_at: new Date().toISOString() })
        .eq("id", latestLog.id)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Recruiter ping error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}