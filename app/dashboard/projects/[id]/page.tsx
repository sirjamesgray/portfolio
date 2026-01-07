import { redirect, notFound } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"
import { ProjectDetailClient } from "./client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CustomerProjectPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check for mirror mode (user-based or project-based)
  const cookieStore = await cookies()
  const mirrorUserId = cookieStore.get("mirror_user_id")?.value
  const mirrorProjectId = cookieStore.get("mirror_project_id")?.value

  const userIsAdmin = isAdmin(user.email)
  const isMirroringUser = mirrorUserId && userIsAdmin
  const isMirroringProject = mirrorProjectId && userIsAdmin && mirrorProjectId === id

  // Use admin client when mirroring to bypass RLS
  const queryClient = (isMirroringUser || isMirroringProject) ? createAdminClient() : supabase

  let project
  let error

  if (isMirroringProject) {
    // Project-based preview: fetch project by ID only (no user_id filter)
    const result = await queryClient
      .from("projects")
      .select(`
        id,
        title,
        description,
        project_type,
        status,
        price,
        amount_paid,
        budget,
        timeline,
        github_url,
        vercel_url,
        created_at,
        end_date,
        user_id,
        requirements,
        requirements_updated_at,
        cancellation_reason,
        customer_opted_out_of_landing_page
      `)
      .eq("id", id)
      .single()
    project = result.data
    error = result.error
  } else {
    // User-based access: fetch project by ID and user_id
    const effectiveUserId = isMirroringUser ? mirrorUserId : user.id
    const result = await queryClient
      .from("projects")
      .select(`
        id,
        title,
        description,
        project_type,
        status,
        price,
        amount_paid,
        budget,
        timeline,
        github_url,
        vercel_url,
        created_at,
        end_date,
        user_id,
        requirements,
        requirements_updated_at,
        cancellation_reason,
        customer_opted_out_of_landing_page
      `)
      .eq("id", id)
      .eq("user_id", effectiveUserId)
      .single()
    project = result.data
    error = result.error
  }

  if (error || !project) {
    notFound()
  }

  // Fetch quotes for this project
  const { data: quotes } = await queryClient
    .from("quotes")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })

  // Fetch invoices for this project
  const { data: invoices } = await queryClient
    .from("invoices")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })

  // Fetch activity log for this project
  const { data: activityLog } = await queryClient
    .from("activity_log")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <ProjectDetailClient
      project={project}
      quotes={quotes || []}
      invoices={invoices || []}
      activityLog={activityLog || []}
    />
  )
}
