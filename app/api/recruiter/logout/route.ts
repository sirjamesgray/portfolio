import { NextResponse } from "next/server"

// Clear the recruiter session cookie.
export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set("recruiter_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
  return res
}
