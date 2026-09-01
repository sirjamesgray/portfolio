/**
 * Portfolio → Helm telemetry emitter.
 *
 * Pushes aggregate product KPIs to Helm's ingestion endpoint
 * (POST /api/v1/telemetry). Only counts cross the boundary — no PII, no
 * credentials, no database dumps. The envelope schema matches Helm's
 * telemetry-ingestion spec (helm/docs/specs/telemetry-ingestion.md).
 *
 * This is the same webhook-push architecture as acp-tx and gallery-room:
 * the product computes its own metrics and POSTs them immediately.
 * Fire-and-forget — never throws, so telemetry can never break a product
 * code path. Only counts cross the boundary — no PII, no credentials.
 */
import { createHash } from "node:crypto"

/** Public Helm base URL (Tailscale Funnel root proxies the Helm prod instance). */
const HELM_TELEMETRY_URL =
  process.env.HELM_TELEMETRY_URL ?? "https://jamies-mac-mini.tailac1b67.ts.net"

const HELM_INGEST_TOKEN = process.env.HELM_INGEST_TOKEN ?? ""

export type HelmMetric = {
  key: string
  label: string
  category: "product" | "growth" | "marketing" | "revenue" | "reliability"
  value: number
  unit: "count" | "percent" | "currency" | "milliseconds" | "seconds" | "bytes" | "ratio"
  period?: "instant" | "day" | "week" | "month" | "all_time"
  previousValue?: number
  source?: string
  platform?: "web" | "ios" | "android" | "ios-native" | "macos" | "api" | "cli" | "unknown"
}

export type HelmEnvelope = {
  schemaVersion: "1.0"
  requestId: string
  productId: string
  sentAt: string
  heartbeat?: {
    status: "healthy" | "degraded" | "down"
    environment: string
    version?: string
    latencyMs?: number
    message?: string
  }
  metrics: HelmMetric[]
}

/**
 * Send one telemetry envelope to Helm. Never throws — on failure it logs a
 * warning and returns false so callers can degrade gracefully.
 */
export async function pushHelmTelemetry(envelope: HelmEnvelope): Promise<boolean> {
  if (!HELM_INGEST_TOKEN) {
    console.warn("[helm-telemetry] HELM_INGEST_TOKEN not set; skipping push")
    return false
  }
  try {
    const response = await fetch(`${HELM_TELEMETRY_URL}/api/v1/telemetry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HELM_INGEST_TOKEN}`,
      },
      body: JSON.stringify(envelope),
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) {
      console.warn(`[helm-telemetry] push failed: ${response.status} ${await response.text()}`)
      return false
    }
    return true
  } catch (error) {
    console.warn("[helm-telemetry] push failed:", error)
    return false
  }
}

/** Stable, deterministic request ID so Helm dedupes retries of the same snapshot window. */
export function telemetryRequestId(prefix: string, windowKey: string): string {
  const hash = createHash("sha1").update(windowKey).digest("hex").slice(0, 24)
  return `${prefix}-${hash}`
}