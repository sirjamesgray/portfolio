import { redirect, notFound } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
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
  const effectiveUserId = (mirrorUserId && isAdmin(user.email)) ? mirrorUserId : user.id
  const userIsAdmin = isAdmin(user.email)

  // Fetch the project - only allow if it belongs to the effective user
  const { data: project, error } = await supabase
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
      user_id
    `)
    .eq("id", id)
    .eq("user_id", effectiveUserId)
    .single()

  if (error || !project) {
    notFound()
  }

  // Fetch quotes for this project
  const { data: quotes } = await supabase
    .from("quotes")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })

  // Fetch invoices for this project
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })

  return (
    <ProjectDetailClient
      project={project}
      quotes={quotes || []}
      invoices={invoices || []}
      currentUserId={effectiveUserId}
      isAdmin={userIsAdmin && !mirrorUserId}
    />
  )
}
