/**
 * Cloudflare Turnstile verification
 * https://developers.cloudflare.com/turnstile/
 */

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileVerifyResult {
  success: boolean;
  error?: string;
}

/**
 * Verify a Turnstile token server-side
 */
export async function verifyTurnstileToken(
  token: string,
  ip?: string
): Promise<TurnstileVerifyResult> {
  if (!TURNSTILE_SECRET_KEY) {
    console.warn("TURNSTILE_SECRET_KEY not configured - skipping verification");
    return { success: true };
  }

  if (!token) {
    return { success: false, error: "Missing Turnstile token" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    if (ip) {
      formData.append("remoteip", ip);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();

    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: data["error-codes"]?.join(", ") || "Verification failed",
    };
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return { success: false, error: "Verification request failed" };
  }
}

/**
 * Get client IP from request headers (works with Vercel/Cloudflare)
 */
export function getClientIP(headers: Headers): string | undefined {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0].trim()
  );
}
