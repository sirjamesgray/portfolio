import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"
import { DashboardOverviewClient } from "./client"
import { MobileMenu } from "@/components/dashboard/mobile-menu"
import { MobileCustomerOverview } from "@/components/dashboard/mobile-customer-overview"
import { AdminDesktopRedirect } from "@/components/dashboard/admin-desktop-redirect"

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const userIsAdmin = isAdmin(user.email)

  // Check for mirror mode
  const cookieStore = await cookies()
  const mirrorUserId = cookieStore.get("mirror_user_id")?.value
  const mirrorProjectId = cookieStore.get("mirror_project_id")?.value
  let effectiveUserId = user.id
  let effectiveUserName = user.user_metadata?.full_name || user.email?.split("@")[0] || ""
  let effectiveUserEmail = user.email || ""

  if (mirrorUserId && userIsAdmin) {
    effectiveUserId = mirrorUserId
    // Look up the mirrored user's info
    const adminSupabase = createAdminClient()
    const { data } = await adminSupabase.auth.admin.getUserById(mirrorUserId)
    if (data?.user) {
      effectiveUserName = data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || ""
      effectiveUserEmail = data.user.email || ""
    }
  }

  // When mirroring, show customer view
  const isMirroring = !!(mirrorUserId || mirrorProjectId)
  const showAdminTools = userIsAdmin && !isMirroring

  const displayEmail = mirrorUserId ? effectiveUserEmail : (user.email || "")

  // Fetch projects for the effective user with quotes and invoices for progress calculation
  // Use admin client when mirroring to bypass RLS
  const queryClient = (mirrorUserId && userIsAdmin) ? createAdminClient() : supabase

  // First get projects
  const { data: projectsRaw, error: projectsError } = await queryClient
    .from("projects")
    .select("id, title, project_type, status, created_at, description, vercel_url, github_url")
    .eq("user_id", effectiveUserId)
    .order("created_at", { ascending: false })

  if (projectsError) {
    console.error("Projects fetch error:", projectsError)
  }

  // Then get quotes and invoices for each project
  const projectIds = projectsRaw?.map(p => p.id) || []

  let quotesMap: Record<string, { id: string; status: string }[]> = {}
  let invoicesMap: Record<string, { id: string; status: string }[]> = {}

  if (projectIds.length > 0) {
    const { data: quotes } = await queryClient
      .from("quotes")
      .select("id, status, project_id")
      .in("project_id", projectIds)

    const { data: invoices } = await queryClient
      .from("invoices")
      .select("id, status, project_id")
      .in("project_id", projectIds)

    // Group by project_id
    quotes?.forEach(q => {
      if (!quotesMap[q.project_id]) quotesMap[q.project_id] = []
      quotesMap[q.project_id].push({ id: q.id, status: q.status })
    })

    invoices?.forEach(i => {
      if (!invoicesMap[i.project_id]) invoicesMap[i.project_id] = []
      invoicesMap[i.project_id].push({ id: i.id, status: i.status })
    })
  }

  // Combine data
  const projects = projectsRaw?.map(p => ({
    ...p,
    quotes: quotesMap[p.id] || [],
    invoices: invoicesMap[p.id] || [],
  })) || []

  return (
    <>
      {/* Mobile: Show admin menu or customer overview */}
      <div className="md:hidden h-full">
        {showAdminTools ? (
          <MobileMenu isAdmin={true} />
        ) : (
          <MobileCustomerOverview
            userName={effectiveUserName}
            projects={projects || []}
          />
        )}
      </div>

      {/* Desktop: Redirect admins to projects page, show overview for customers */}
      <div className="hidden md:block">
        {showAdminTools ? (
          <AdminDesktopRedirect />
        ) : (
          <DashboardOverviewClient
            userName={effectiveUserName}
            projects={projects || []}
          />
        )}
      </div>
    </>
  )
}
