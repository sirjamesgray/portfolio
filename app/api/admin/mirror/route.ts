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

  const { userId, returnUrl } = await request.json()

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

  // Store the return URL so we can go back to admin context
  if (returnUrl) {
    response.cookies.set("mirror_return_url", returnUrl, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
    })
  }

  return response
}

export async function DELETE(request: NextRequest) {
  // Get the return URL from the cookie
  const returnUrl = request.cookies.get("mirror_return_url")?.value

  const response = NextResponse.json({
    success: true,
    returnUrl: returnUrl || "/dashboard"
  })
  response.cookies.delete("mirror_user_id")
  response.cookies.delete("mirror_return_url")
  return response
}
