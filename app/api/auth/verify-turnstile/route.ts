import { NextResponse } from "next/server"
import { verifyTurnstileToken, getClientIP } from "@/lib/turnstile"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    const ip = getClientIP(request.headers)
    const result = await verifyTurnstileToken(token, ip)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Verification failed" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Turnstile verification error:", error)
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    )
  }
}
