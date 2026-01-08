import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/constants"
import { redirect } from "next/navigation"
import { getAllFeatureFlags } from "@/lib/feature-flags"
import { FeatureFlagsClient } from "./client"

export default async function FeatureFlagsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    redirect("/dashboard")
  }

  const flags = await getAllFeatureFlags()

  return <FeatureFlagsClient flags={flags} />
}
