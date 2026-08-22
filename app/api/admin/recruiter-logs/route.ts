import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get("limit") || "50")
    const offset = parseInt(url.searchParams.get("offset") || "0")

    const adminClient = createAdminClient()

    const { data: logs, error, count } = await adminClient
      .from("recruiter_access_logs")
      .select("*, recruiter_passwords!inner(label)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching access logs:", error)
      return NextResponse.json(
        { error: "Failed to fetch access logs" },
        { status: 500 }
      )
    }

    const formatted = logs.map((log) => ({
      id: log.id,
      password_id: log.password_id,
      password_label: log.recruiter_passwords?.label || "Unknown",
      visitor_name: log.visitor_name,
      visitor_company: log.visitor_company,
      visitor_message: log.visitor_message,
      ip_address: log.ip_address,
      user_agent: log.user_agent,
      referrer: log.referrer,
      created_at: log.created_at,
    }))

    return NextResponse.json({
      logs: formatted,
      total: count || 0,
      limit,
      offset,
    })
  } catch (err) {
    console.error("Admin access logs error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}