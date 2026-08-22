import { NextRequest, NextResponse } from "next/server"
import { getSessionFromCookies } from "@/lib/recruiter-auth"

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie")
  const session = getSessionFromCookies(cookieHeader)

  if (!session) {
    return NextResponse.json({ authenticated: false })
  }

  return NextResponse.json({
    authenticated: true,
    session: {
      password_label: session.password_label,
      visitor_name: session.visitor_name,
    },
  })
}