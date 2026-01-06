import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"
import { redirect } from "next/navigation"
import { AdminsClient } from "./client"

export default async function AdminsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Verify user is admin
  if (!user || !isAdmin(user.email)) {
    redirect("/dashboard")
  }

  // Use admin client to fetch users
  const adminSupabase = createAdminClient()

  // Get all users from auth.users using admin API
  const { data: authUsers, error: authError } = await adminSupabase.auth.admin.listUsers()

  if (authError) {
    console.error("Error fetching users:", authError)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Error loading admins</p>
      </div>
    )
  }

  // Filter to only admin users
  const admins = (authUsers?.users || [])
    .filter((authUser) => isAdmin(authUser.email))
    .map((authUser) => ({
      id: authUser.id,
      email: authUser.email || "",
      name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Unknown",
      created_at: authUser.created_at,
      last_sign_in: authUser.last_sign_in_at || null,
    }))

  // Sort by most recent first
  admins.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return <AdminsClient admins={admins} currentUserId={user.id} />
}
