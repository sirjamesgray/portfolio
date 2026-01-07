import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { reason } = body

  if (!reason || reason.trim().length === 0) {
    return NextResponse.json(
      { error: "A reason is required to archive a project" },
      { status: 400 }
    )
  }

  const adminSupabase = createAdminClient()

  // Update the project: set status to canceled and add cancellation reason
  const { error: updateError } = await adminSupabase
    .from("projects")
    .update({
      status: "canceled",
      cancellation_reason: reason.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (updateError) {
    console.error("Error archiving project:", updateError)
    return NextResponse.json(
      { error: "Failed to archive project" },
      { status: 500 }
    )
  }

  // Log the activity
  await adminSupabase.from("activity_log").insert({
    project_id: id,
    action: "project_archived",
    details: `Project archived: ${reason.trim()}`,
  })

  return NextResponse.json({ success: true })
}

// Restore an archived project
export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const adminSupabase = createAdminClient()

  // Restore the project: set status back to consultation and clear cancellation reason
  const { error: updateError } = await adminSupabase
    .from("projects")
    .update({
      status: "consultation",
      cancellation_reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (updateError) {
    console.error("Error restoring project:", updateError)
    return NextResponse.json(
      { error: "Failed to restore project" },
      { status: 500 }
    )
  }

  // Log the activity
  await adminSupabase.from("activity_log").insert({
    project_id: id,
    action: "project_restored",
    details: "Project restored from archive",
  })

  return NextResponse.json({ success: true })
}
