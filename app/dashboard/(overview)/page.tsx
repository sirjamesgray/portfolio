import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"
import { DashboardOverviewClient } from "./client"

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Check for mirror mode
  const cookieStore = await cookies()
  const mirrorUserId = cookieStore.get("mirror_user_id")?.value
  let effectiveUserId = user.id
  let effectiveUserName = user.user_metadata?.full_name || user.email?.split("@")[0] || ""

  if (mirrorUserId && isAdmin(user.email)) {
    effectiveUserId = mirrorUserId
    // Look up the mirrored user's name
    const adminSupabase = createAdminClient()
    const { data } = await adminSupabase.auth.admin.getUserById(mirrorUserId)
    if (data?.user) {
      effectiveUserName = data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || ""
    }
  }

  // Fetch projects for the effective user
  const { data: projects } = await supabase
    .from("projects")
    .select("id, project_type, status, created_at, description")
    .eq("user_id", effectiveUserId)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <DashboardOverviewClient
      userName={effectiveUserName}
      projects={projects || []}
    />
  )
}
