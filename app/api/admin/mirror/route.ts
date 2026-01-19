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

  const { userId, projectId, returnUrl } = await request.json()

  // Must have either userId (mirror as specific user) or projectId (preview project as customer)
  if (!userId && !projectId) {
    return NextResponse.json({ error: "User ID or Project ID required" }, { status: 400 })
  }

  const response = NextResponse.json({ success: true })

  // Clear any existing mirror cookies first
  response.cookies.delete("mirror_user_id")
  response.cookies.delete("mirror_project_id")

  if (userId) {
    // Mirror as specific user (from customer page)
    response.cookies.set("mirror_user_id", userId, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
    })
  } else if (projectId) {
    // Preview project as any customer (from project page)
    response.cookies.set("mirror_project_id", projectId, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
    })
  }

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
  const supabase = await createClient()

  // Verify the current user is an admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get the return URL from the cookie
  const returnUrl = request.cookies.get("mirror_return_url")?.value

  const response = NextResponse.json({
    success: true,
    returnUrl: returnUrl || "/dashboard"
  })
  response.cookies.delete("mirror_user_id")
  response.cookies.delete("mirror_project_id")
  response.cookies.delete("mirror_return_url")
  return response
}
