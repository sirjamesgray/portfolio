/**
 * Basic in-memory rate limiter for serverless functions.
 *
 * NOTE: This is a simple implementation that works per-instance.
 * For production with multiple serverless instances, use @upstash/ratelimit:
 *
 *   bun add @upstash/ratelimit @upstash/redis
 *
 * Then replace this with:
 *   import { Ratelimit } from "@upstash/ratelimit"
 *   import { Redis } from "@upstash/redis"
 *   export const ratelimit = new Ratelimit({
 *     redis: Redis.fromEnv(),
 *     limiter: Ratelimit.slidingWindow(10, "1 m"),
 *   })
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store (cleared on cold start in serverless)
const store = new Map<string, RateLimitEntry>()

// Clean up old entries periodically
const CLEANUP_INTERVAL = 60 * 1000 // 1 minute
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
  lastCleanup = now
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check rate limit for an identifier (e.g., IP address)
 * @param identifier - Unique identifier for the client
 * @param limit - Max requests allowed in the window (default: 10)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  limit = 10,
  windowMs = 60 * 1000
): RateLimitResult {
  cleanup()

  const now = Date.now()
  const entry = store.get(identifier)

  // No existing entry or window expired
  if (!entry || entry.resetAt < now) {
    store.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    })
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    }
  }

  // Within window, check count
  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetAt,
    }
  }

  // Increment count
  entry.count++
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetAt,
  }
}

/**
 * Get client IP from request headers (works with Vercel/Cloudflare)
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  const realIp = request.headers.get("x-real-ip")
  if (realIp) {
    return realIp
  }

  // Fallback for local development
  return "127.0.0.1"
}
