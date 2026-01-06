import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/constants"
import { MyProjectsClient } from "./client"

export default async function MyProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Check for mirror mode
  const cookieStore = await cookies()
  const mirrorUserId = cookieStore.get("mirror_user_id")?.value
  const effectiveUserId = (mirrorUserId && isAdmin(user.email)) ? mirrorUserId : user.id

  // Fetch projects for the effective user
  const { data: projects } = await supabase
    .from("projects")
    .select("id, project_type, budget, timeline, status, created_at, description")
    .eq("user_id", effectiveUserId)
    .order("created_at", { ascending: false })

  return <MyProjectsClient projects={projects || []} />
}
