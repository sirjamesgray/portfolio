import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const adminSupabase = createAdminClient()

  const [quotesResult, invoicesResult] = await Promise.all([
    adminSupabase
      .from("quotes")
      .select("id, status, title, description, amount, valid_until, sent_at, responded_at, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    adminSupabase
      .from("invoices")
      .select("id, status, amount, invoice_url, paid_at, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
  ])

  return NextResponse.json({
    quotes: quotesResult.data || [],
    invoices: invoicesResult.data || [],
  })
}
