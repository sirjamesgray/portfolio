import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/constants"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Verify the current user is an admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userId } = await request.json()

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  // Set a cookie to store the mirrored user ID
  const response = NextResponse.json({ success: true })
  response.cookies.set("mirror_user_id", userId, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2 hours
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("mirror_user_id")
  return response
}
