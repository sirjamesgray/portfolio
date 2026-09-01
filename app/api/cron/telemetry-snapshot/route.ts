/**
 * Cron route: Portfolio daily telemetry snapshot → Helm.
 *
 * Computes aggregate counts (showcased projects, inbound inquiries,
 * revenue) from the product database and POSTs them to Helm's telemetry
 * ingestion endpoint. Visitors come from the Vercel Web Analytics API.
 * Only counts cross the boundary — never PII.
 *
 * Auth: CRON_SECRET Bearer, same as the other cron routes. Vercel Cron
 * invokes the route with a GET request, which is why GET is exported.
 */
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  pushHelmTelemetry,
  telemetryRequestId,
  type HelmEnvelope,
  type HelmMetric,
} from "@/lib/telemetry/helm"

export const dynamic = "force-dynamic"

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`
}

/** Showcased projects: admin-enabled and not soft-deleted. Defensive. */
async function countShowcasedProjects(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("show_on_landing_page", true)
      .is("deleted_at", null)
    if (error) return 0
    return count ?? 0
  } catch {
    return 0
  }
}

/** Inquiries: project submissions from the public form. Defensive. */
async function countInquiries(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("activity_log")
      .select("*", { count: "exact", head: true })
      .eq("action", "project_submitted")
    if (error) return 0
    return count ?? 0
  } catch {
    return 0
  }
}

/** Revenue from paid invoices (amount_paid column, stored in dollars). */
async function revenuePaid(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<{ cents: number; count: number }> {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("amount_paid")
      .eq("status", "paid")
    if (error || !data) return { cents: 0, count: 0 }
    return {
      cents: Math.round(
        data.reduce((sum, inv) => sum + (Number(inv.amount_paid) || 0), 0) * 100,
      ),
      count: data.length,
    }
  } catch {
    return { cents: 0, count: 0 }
  }
}

/** Fetch unique visitors from Vercel Web Analytics (last 24h → today). */
async function fetchVisitors(): Promise<number> {
  const token = process.env.VERCEL_TOKEN
  const teamId = process.env.VERCEL_TEAM_ID
  const projectId = process.env.VERCEL_PROJECT_ID
  if (!token || !teamId || !projectId) {
    console.warn("[helm-telemetry] VERCEL_TOKEN/TEAM/PROJECT not set; visitors = 0")
    return 0
  }
  const now = new Date()
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const until = now.toISOString().slice(0, 10)
  const params = new URLSearchParams({ teamId, projectId, since, until })
  try {
    const response = await fetch(
      `https://api.vercel.com/v1/query/web-analytics/visits/count?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(10_000),
      },
    )
    if (!response.ok) {
      console.warn(`[helm-telemetry] Vercel Analytics API failed: ${response.status}`)
      return 0
    }
    const payload = (await response.json()) as { data?: { visitors?: number } }
    return payload.data?.visitors ?? 0
  } catch (error) {
    console.warn("[helm-telemetry] Vercel Analytics API error:", error)
    return 0
  }
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const windowKey = new Date().toISOString().slice(0, 10) // one snapshot per day

  const [projectsShowcased, inquiries, payments, visitors] = await Promise.all([
    countShowcasedProjects(supabase),
    countInquiries(supabase),
    revenuePaid(supabase),
    fetchVisitors(),
  ])

  const metrics: HelmMetric[] = [
    {
      key: "portfolio_views",
      label: "Portfolio views",
      category: "growth",
      value: visitors,
      unit: "count",
      period: "day",
      source: "Vercel Web Analytics API",
    },
    {
      key: "projects_showcased",
      label: "Projects showcased",
      category: "product",
      value: projectsShowcased,
      unit: "count",
      period: "all_time",
      source: "projects (show_on_landing_page=true)",
    },
    {
      key: "inbound_inquiries",
      label: "Inbound inquiries",
      category: "revenue",
      value: inquiries,
      unit: "count",
      period: "all_time",
      source: "activity_log project_submitted",
    },
    {
      key: "payments_collected",
      label: "Payments collected",
      category: "revenue",
      value: payments.count,
      unit: "count",
      period: "all_time",
      source: "invoices (status=paid)",
    },
    {
      key: "revenue_collected_cents",
      label: "Revenue collected",
      category: "revenue",
      value: payments.cents,
      unit: "currency",
      period: "all_time",
      source: "invoices.amount_paid (status=paid)",
    },
  ]

  const envelope: HelmEnvelope = {
    schemaVersion: "1.0",
    requestId: telemetryRequestId("portfolio", windowKey),
    productId: "portfolio",
    sentAt: new Date().toISOString(),
    heartbeat: {
      status: "healthy",
      environment: process.env.NODE_ENV ?? "production",
      message: "Portfolio cron telemetry snapshot",
    },
    metrics,
  }

  const accepted = await pushHelmTelemetry(envelope)

  return NextResponse.json({
    accepted,
    productId: "portfolio",
    window: windowKey,
    metrics: metrics.map((m) => ({ key: m.key, value: m.value })),
  })
}