import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const adminSupabase = createAdminClient()

  const { data: activityLog, error } = await adminSupabase
    .from("activity_log")
    .select("id, action, details, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching activity log:", error)
    return NextResponse.json({ error: "Failed to fetch activity log" }, { status: 500 })
  }

  return NextResponse.json({ activityLog: activityLog || [] })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const adminSupabase = createAdminClient()

  const { error } = await adminSupabase
    .from("activity_log")
    .insert({
      project_id: projectId,
      action: body.action,
      details: body.details,
    })

  if (error) {
    console.error("Error creating activity log:", error)
    return NextResponse.json({ error: "Failed to create activity log" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
