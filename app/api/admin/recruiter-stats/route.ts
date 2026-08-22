import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const adminClient = createAdminClient()

    // Use the stats view for per-password aggregates
    const { data: stats, error: statsError } = await adminClient
      .from("recruiter_password_stats")
      .select("*")

    if (statsError) {
      // Backfill: compute stats manually from tables if view doesn't exist
      console.error("Stats view error, falling back:", statsError)

      const { data: pwds } = await adminClient
        .from("recruiter_passwords")
        .select("id, label, is_active, created_at")

      const { data: allLogs } = await adminClient
        .from("recruiter_access_logs")
        .select("*")
        .order("created_at", { ascending: false })

      if (!pwds) {
        return NextResponse.json({ stats: [], total: 0 }, { status: 200 })
      }

      const stats = pwds.map((pw) => {
        const logs = (allLogs || []).filter((l) => l.password_id === pw.id)
        const lastLog = logs[0] || null
        const avgSessionSeconds = logs
          .filter((l) => l.last_active_at)
          .reduce((sum, l) => {
            const diff =
              new Date(l.last_active_at).getTime() - new Date(l.created_at).getTime()
            return sum + diff / 1000
          }, 0)
        return {
          password_id: pw.id,
          password_label: pw.label,
          is_active: pw.is_active,
          total_visits: logs.length,
          unique_visitors: [...new Set(logs.map((l) => l.visitor_name))].length,
          last_visit_at: lastLog?.created_at || null,
          avg_session_seconds: logs.filter((l) => l.last_active_at).length > 0
            ? avgSessionSeconds / logs.filter((l) => l.last_active_at).length
            : null,
        }
      })

      return NextResponse.json({ stats, total: stats.length })
    }

    return NextResponse.json({ stats, total: stats.length })
  } catch (err) {
    console.error("Admin recruiter stats error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}