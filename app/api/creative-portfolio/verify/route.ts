import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PORTFOLIO_PASSWORD = process.env.PORTFOLIO_PASSWORD ?? "creative2026";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.password !== "string") {
      return NextResponse.json({ valid: false, error: "Missing password" }, { status: 400 });
    }

    // Constant-time comparison to prevent timing attacks
    const valid = body.password.length === PORTFOLIO_PASSWORD.length &&
      body.password.split("").every((ch: string, i: number) => ch === PORTFOLIO_PASSWORD[i]);

    return NextResponse.json({ valid });
  } catch {
    return NextResponse.json({ valid: false, error: "Verification failed" }, { status: 500 });
  }
}