import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"
import { redirect } from "next/navigation"
import { CustomersClient } from "./client"

type Project = {
  id: string
  project_type: string | null
  status: string
  created_at: string
  user_id: string | null
}

export default async function AdminCustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Verify user is admin
  if (!user || !isAdmin(user.email)) {
    redirect("/dashboard")
  }

  // Use admin client to fetch users
  const adminSupabase = createAdminClient()

  // Get all users from auth.users using admin API
  const { data: authUsers, error: authError } = await adminSupabase.auth.admin.listUsers()

  if (authError) {
    console.error("Error fetching users:", authError)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Error loading customers</p>
      </div>
    )
  }

  // Get all projects with user_id
  const { data: projects, error: projectsError } = await adminSupabase
    .from("projects")
    .select("id, project_type, status, created_at, user_id")
    .order("created_at", { ascending: false })

  if (projectsError) {
    console.error("Error fetching projects:", projectsError)
  }

  // Filter to only non-admin users (customers)
  const customers = (authUsers?.users || [])
    .filter((authUser) => !isAdmin(authUser.email))
    .map((authUser) => ({
      id: authUser.id,
      email: authUser.email || "",
      name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Unknown",
      created_at: authUser.created_at,
      last_sign_in: authUser.last_sign_in_at || null,
      projects: ((projects || []) as Project[])
        .filter((p) => p.user_id === authUser.id)
        .map((p) => ({
          id: p.id,
          project_type: p.project_type,
          status: p.status,
          created_at: p.created_at,
        })),
    }))

  // Sort by most recent first
  customers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const stats = {
    totalCustomers: customers.length,
    totalProjects: projects?.filter((p) => {
      const user = authUsers?.users?.find((u) => u.id === p.user_id)
      return user && !isAdmin(user.email)
    }).length || 0,
    activeProjects: projects?.filter((p) => {
      const user = authUsers?.users?.find((u) => u.id === p.user_id)
      return user && !isAdmin(user.email) && p.status === "in_progress"
    }).length || 0,
    customersWithProjects: customers.filter((c) => c.projects.length > 0).length,
  }

  return <CustomersClient customers={customers} stats={stats} />
}
