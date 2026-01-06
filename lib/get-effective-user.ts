import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/constants"

export async function getEffectiveUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Check if admin is mirroring another user
  if (isAdmin(user.email)) {
    const cookieStore = await cookies()
    const mirrorUserId = cookieStore.get("mirror_user_id")?.value
    if (mirrorUserId) {
      return mirrorUserId
    }
  }

  return user.id
}
