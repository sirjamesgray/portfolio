/**
 * Cron route: Portfolio daily telemetry snapshot → Helm.
 *
 * Computes aggregate KPIs (visitors, projects showcased, contact form
 * submissions) from the product database and POSTs them to Helm's telemetry
 * ingestion endpoint. Visitors come from the Vercel Web Analytics API.
 * Only counts cross the boundary — never PII.
 *
 * Auth: CRON_SECRET Bearer, same as the other cron routes. Vercel Cron
 * invokes the route with a GET request, which is why GET is exported.
 * When CRON_SECRET is unset (local dev), the route is accessible without auth.
 *
 * Schedule: 0 6 * * * (daily at 06:00 UTC).
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
  if (!secret) return process.env.NODE_ENV !== "production"
  return request.headers.get("authorization") === `Bearer ${secret}`
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

/** Contact form submissions from the public start-project form. Defensive. */
async function countContactFormSubmissions(
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

  const [projectsShowcased, submissions, visitors] = await Promise.all([
    countShowcasedProjects(supabase),
    countContactFormSubmissions(supabase),
    fetchVisitors(),
  ])

  const metrics: HelmMetric[] = [
    {
      key: "visitors",
      label: "Visitors",
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
      key: "contact_form_submissions",
      label: "Contact form submissions",
      category: "marketing",
      value: submissions,
      unit: "count",
      period: "all_time",
      source: "activity_log (action=project_submitted)",
    },
  ]

  const envelope: HelmEnvelope = {
    schemaVersion: "1.0",
    requestId: telemetryRequestId("portfolio", windowKey),
    productId: "portfolio",
    sentAt: new Date().toISOString(),
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