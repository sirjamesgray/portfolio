import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"
import { redirect, notFound } from "next/navigation"
import { CustomerDetailClient } from "./client"

type Quote = {
  id: string
  status: string
  amount: number
  created_at: string
}

type Invoice = {
  id: string
  status: string
  amount: number
  created_at: string
}

type Project = {
  id: string
  title: string | null
  project_type: string | null
  status: string
  created_at: string
  description: string | null
  price: number | null
  amount_paid: number | null
  vercel_url: string | null
  github_url: string | null
  quotes: Quote[]
  invoices: Invoice[]
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Verify user is admin
  if (!user || !isAdmin(user.email)) {
    redirect("/dashboard")
  }

  const adminSupabase = createAdminClient()

  // Get the customer's user info
  const { data: customerData, error: customerError } = await adminSupabase.auth.admin.getUserById(id)

  if (customerError || !customerData?.user) {
    notFound()
  }

  const customer = customerData.user

  // Don't show admin users in the customer detail page
  if (isAdmin(customer.email)) {
    redirect("/dashboard/admin/customers")
  }

  // Get customer's projects
  const { data: projectsRaw, error: projectsError } = await adminSupabase
    .from("projects")
    .select("id, title, project_type, status, created_at, description, price, amount_paid, vercel_url, github_url")
    .eq("user_id", id)
    .order("created_at", { ascending: false })

  if (projectsError) {
    console.error("Error fetching projects:", projectsError)
  }

  // Get quotes and invoices for each project
  const projectIds = projectsRaw?.map(p => p.id) || []
  let quotesMap: Record<string, Quote[]> = {}
  let invoicesMap: Record<string, Invoice[]> = {}

  if (projectIds.length > 0) {
    const { data: quotes } = await adminSupabase
      .from("quotes")
      .select("id, status, amount, created_at, project_id")
      .in("project_id", projectIds)

    const { data: invoices } = await adminSupabase
      .from("invoices")
      .select("id, status, amount, created_at, project_id")
      .in("project_id", projectIds)

    quotes?.forEach(q => {
      if (!quotesMap[q.project_id]) quotesMap[q.project_id] = []
      quotesMap[q.project_id].push({ id: q.id, status: q.status, amount: q.amount, created_at: q.created_at })
    })

    invoices?.forEach(i => {
      if (!invoicesMap[i.project_id]) invoicesMap[i.project_id] = []
      invoicesMap[i.project_id].push({ id: i.id, status: i.status, amount: i.amount, created_at: i.created_at })
    })
  }

  const projects: Project[] = projectsRaw?.map(p => ({
    ...p,
    quotes: quotesMap[p.id] || [],
    invoices: invoicesMap[p.id] || [],
  })) || []

  // Calculate stats
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === "development").length,
    deliveredProjects: projects.filter(p => p.status === "delivered").length,
    totalRevenue: projects.reduce((sum, p) => sum + (p.amount_paid || 0), 0),
  }

  const customerInfo = {
    id: customer.id,
    email: customer.email || "",
    name: customer.user_metadata?.full_name || customer.email?.split("@")[0] || "Unknown",
    created_at: customer.created_at,
    last_sign_in: customer.last_sign_in_at || null,
    phone: customer.phone || null,
  }

  return <CustomerDetailClient customer={customerInfo} projects={projects} stats={stats} />
}
