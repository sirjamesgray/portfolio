import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"
import { PaymentsClient } from "./client"

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const userIsAdmin = isAdmin(user.email)

  // Check for mirror mode
  const cookieStore = await cookies()
  const mirrorUserId = cookieStore.get("mirror_user_id")?.value
  let effectiveUserId = user.id

  if (mirrorUserId && userIsAdmin) {
    effectiveUserId = mirrorUserId
  }

  // Use admin client when mirroring to bypass RLS
  const queryClient = (mirrorUserId && userIsAdmin) ? createAdminClient() : supabase

  // Get all projects for this user
  const { data: projects } = await queryClient
    .from("projects")
    .select("id, title")
    .eq("user_id", effectiveUserId)

  const projectIds = projects?.map(p => p.id) || []

  // Get all invoices for these projects
  let invoices: Array<{
    id: string
    project_id: string
    amount: number
    status: string
    due_date: string | null
    invoice_url: string | null
    invoice_pdf: string | null
    created_at: string
    project_title: string | null
  }> = []

  if (projectIds.length > 0) {
    const { data: invoicesData } = await queryClient
      .from("invoices")
      .select("id, project_id, amount, status, due_date, invoice_url, invoice_pdf, created_at")
      .in("project_id", projectIds)
      .order("created_at", { ascending: false })

    // Map project titles to invoices
    const projectMap = new Map(projects?.map(p => [p.id, p.title]) || [])
    invoices = (invoicesData || []).map(inv => ({
      ...inv,
      project_title: projectMap.get(inv.project_id) || null,
    }))
  }

  return <PaymentsClient invoices={invoices} />
}
