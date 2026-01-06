import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
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

  const body = await request.json()
  const { title, project_type, user_id, status } = body

  if (!title) {
    return NextResponse.json({ error: "Project title is required" }, { status: 400 })
  }

  // Use admin client to bypass RLS
  const adminSupabase = createAdminClient()

  const { data: project, error } = await adminSupabase
    .from("projects")
    .insert({
      title,
      project_type: project_type || null,
      user_id: user_id || null,
      status: status || "lead",
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }

  return NextResponse.json({ id: project.id, success: true })
}
