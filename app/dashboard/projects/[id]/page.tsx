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

  // Check for mirror mode
  const cookieStore = await cookies()
  const mirrorUserId = cookieStore.get("mirror_user_id")?.value
  const isMirroring = mirrorUserId && isAdmin(user.email)
  const effectiveUserId = isMirroring ? mirrorUserId : user.id

  // Use admin client when mirroring to bypass RLS
  const queryClient = isMirroring ? createAdminClient() : supabase

  // Fetch the project - only allow if it belongs to the effective user
  const { data: project, error } = await queryClient
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
      cancellation_reason
    `)
    .eq("id", id)
    .eq("user_id", effectiveUserId)
    .single()

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

  return (
    <ProjectDetailClient
      project={project}
      quotes={quotes || []}
      invoices={invoices || []}
    />
  )
}
