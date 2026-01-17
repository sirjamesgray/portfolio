import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { name, enabled, description } = body

  if (typeof name !== "string" || typeof enabled !== "boolean") {
    return NextResponse.json(
      { error: "Invalid request: name (string) and enabled (boolean) required" },
      { status: 400 }
    )
  }

  const adminSupabase = createAdminClient()

  // Build update payload - include description if provided
  const updatePayload: {
    enabled: boolean
    updated_at: string
    updated_by: string | null
    description?: string
  } = {
    enabled,
    updated_at: new Date().toISOString(),
    updated_by: user.email,
  }

  if (typeof description === "string") {
    updatePayload.description = description
  }

  const { error } = await adminSupabase
    .from("feature_flags")
    .update(updatePayload)
    .eq("name", name)

  if (error) {
    console.error("Error updating feature flag:", error)
    return NextResponse.json({ error: "Failed to update feature flag" }, { status: 500 })
  }

  return NextResponse.json({ success: true, name, enabled })
}
