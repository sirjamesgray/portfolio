import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"
import { redirect } from "next/navigation"
import { AdminProjectsClient } from "./client"

type Contact = {
  name: string
  email: string
}

type Project = {
  id: string
  title: string | null
  status: string
  project_type: string | null
  price: number | null
  amount_paid: number | null
  end_date: string | null
  meeting_time: string | null
  created_at: string
  user_id: string | null
  contacts: Contact | Contact[] | null
}

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    redirect("/dashboard")
  }

  // Use admin client to bypass RLS and get all projects
  const adminSupabase = createAdminClient()

  const { data: projects, error } = await adminSupabase
    .from("projects")
    .select(`
      id,
      title,
      status,
      project_type,
      price,
      amount_paid,
      end_date,
      meeting_time,
      created_at,
      user_id,
      contacts (
        name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Error loading projects</p>
      </div>
    )
  }

  // Get user info for each project
  const userIds = [...new Set(projects?.filter(p => p.user_id).map(p => p.user_id) as string[])]
  const { data: authUsers } = await adminSupabase.auth.admin.listUsers()

  const userMap = new Map(
    authUsers?.users?.map(u => [u.id, {
      email: u.email || "",
      name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Unknown",
      isAdmin: isAdmin(u.email),
    }]) || []
  )

  const projectsWithUsers = (projects || []).map(project => ({
    ...project,
    user: project.user_id ? userMap.get(project.user_id) || null : null,
  }))

  const stats = {
    totalProjects: projects?.length || 0,
    leads: projects?.filter(p => p.status === "lead").length || 0,
    inProgress: projects?.filter(p => p.status === "in_progress").length || 0,
    completed: projects?.filter(p => p.status === "completed").length || 0,
  }

  return <AdminProjectsClient projects={projectsWithUsers} stats={stats} />
}
