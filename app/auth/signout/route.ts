import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  // Sign out user
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error signing out:", error)
  }

  const { origin } = new URL(request.url)

  // Create response with redirect
  const response = NextResponse.redirect(`${origin}/`, { status: 302 })

  // Clear all Supabase auth cookies
  const cookieNames = [
    "sb-access-token",
    "sb-refresh-token",
    "sb-knjugovolotmeulfhzte-auth-token",
    "sb-knjugovolotmeulfhzte-auth-token.0",
    "sb-knjugovolotmeulfhzte-auth-token.1",
  ]

  for (const name of cookieNames) {
    response.cookies.set(name, "", {
      expires: new Date(0),
      path: "/",
    })
  }

  return response
}
