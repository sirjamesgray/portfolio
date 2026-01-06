import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/constants"
import { redirect } from "next/navigation"
import { emailTemplates } from "@/emails"
import { AdminEmailsClient } from "./client"

export default async function AdminEmailsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    redirect("/dashboard")
  }

  return <AdminEmailsClient templates={emailTemplates} />
}
