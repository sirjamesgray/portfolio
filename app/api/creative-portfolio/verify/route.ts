import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

function getPortfolioPassword(): string {
  const pw = process.env.PORTFOLIO_PASSWORD ?? "";
  if (!pw) {
    throw new Error("PORTFOLIO_PASSWORD environment variable is required");
  }
  return pw;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit password attempts: 5 per 15 minutes per IP.
    const clientIp = getClientIp(request)
    const rl = checkRateLimit(`creative-portfolio-verify:${clientIp}`, 5, 15 * 60 * 1000)
    if (!rl.success) {
      return NextResponse.json({ valid: false, error: "Too many attempts" }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.password !== "string") {
      return NextResponse.json({ valid: false, error: "Missing password" }, { status: 400 });
    }

    const password = getPortfolioPassword();

    // Timing-safe comparison using Node.js crypto
    const valid =
      body.password.length === password.length &&
      crypto.timingSafeEqual(
        Buffer.from(body.password, "utf8"),
        Buffer.from(password, "utf8"),
      );

    return NextResponse.json({ valid });
  } catch {
    return NextResponse.json({ valid: false, error: "Verification failed" }, { status: 500 });
  }
}