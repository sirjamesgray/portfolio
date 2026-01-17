import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/constants"
import { redirect } from "next/navigation"
import { getActiveLandingPage } from "@/lib/feature-flags"
import { LandingPagesClient } from "./client"

export default async function LandingPagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    redirect("/dashboard")
  }

  const activePage = await getActiveLandingPage()

  return <LandingPagesClient activePage={activePage} />
}
