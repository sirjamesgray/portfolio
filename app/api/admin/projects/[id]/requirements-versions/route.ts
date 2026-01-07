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

  const { data: versions, error } = await adminSupabase
    .from("requirements_versions")
    .select("id, content, updated_by_name, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching requirements versions:", error)
    return NextResponse.json({ error: "Failed to fetch requirements versions" }, { status: 500 })
  }

  return NextResponse.json({ versions: versions || [] })
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
    .from("requirements_versions")
    .insert({
      project_id: projectId,
      content: body.content,
      updated_by: user.id,
      updated_by_name: body.updated_by_name,
    })

  if (error) {
    console.error("Error creating requirements version:", error)
    return NextResponse.json({ error: "Failed to create requirements version" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
