import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

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