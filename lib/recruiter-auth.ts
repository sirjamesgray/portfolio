// Password hashing and session utilities for the recruiter area
// Uses Node.js built-in crypto (no external deps needed)

import crypto from "crypto"

/** True when the session secret is set. The recruiter area stays locked when it is not. */
export function isRecruiterConfigured(): boolean {
  return (process.env.RECRUITER_SESSION_SECRET ?? "").length >= 16
}

function getSessionSecret(): string {
  const secret = process.env.RECRUITER_SESSION_SECRET ?? "";
  if (!secret) {
    throw new Error("RECRUITER_SESSION_SECRET environment variable is required");
  }
  return secret;
}

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

// --- Password Hashing ---

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
  return { hash, salt }
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const derived = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
  const a = Buffer.from(derived, "hex")
  const b = Buffer.from(hash, "hex")
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/**
 * Optional shared password from the RECRUITER_PASSWORD environment variable.
 * The compare uses SHA-256 digests, so the length never leaks and the compare takes constant time.
 */
export function verifyEnvPassword(password: string): boolean {
  const expected = process.env.RECRUITER_PASSWORD ?? ""
  if (!expected) return false
  const a = crypto.createHash("sha256").update(password).digest()
  const b = crypto.createHash("sha256").update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}

// --- Session Token ---

interface RecruiterSessionPayload {
  password_id: string
  password_label: string
  visitor_name: string
  visitor_company: string
  visitor_message: string
  exp: number
}

export function createSessionToken(payload: Omit<RecruiterSessionPayload, "exp">): string {
  const exp = Date.now() + SESSION_DURATION_MS
  const data = JSON.stringify({ ...payload, exp })
  const hmac = crypto.createHmac("sha256", getSessionSecret()).update(data).digest("hex")
  const encoded = Buffer.from(data).toString("base64url")
  return `${encoded}.${hmac}`
}

export function verifySessionToken(token: string): RecruiterSessionPayload | null {
  const parts = token.split(".")
  if (parts.length !== 2) return null

  const [encoded, hmac] = parts

  try {
    const data = Buffer.from(encoded, "base64url").toString("utf8")
    const expected = crypto.createHmac("sha256", getSessionSecret()).update(data).digest("hex")

    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hmac))) {
      return null
    }

    const payload = JSON.parse(data) as RecruiterSessionPayload

    if (Date.now() > payload.exp) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function getSessionFromCookies(
  cookieHeader: string | null
): RecruiterSessionPayload | null {
  if (!cookieHeader) return null

  const cookies = Object.fromEntries(
    cookieHeader.split(/;\s*/).map((c) => {
      const eq = c.indexOf("=")
      return [c.slice(0, eq), c.slice(eq + 1)]
    })
  )

  const token = cookies["recruiter_session"]
  if (!token) return null

  return verifySessionToken(token)
}

export const RECRUITER_COOKIE = "recruiter_session"
