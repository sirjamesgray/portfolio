import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verify admin access
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminSupabase = createAdminClient()

    // The id is the auth user id - get user info first
    const { data: customerData, error: customerError } = await adminSupabase.auth.admin.getUserById(id)

    if (customerError || !customerData?.user) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customerEmail = customerData.user.email
    const customerName = customerData.user.user_metadata?.full_name || customerEmail

    // Delete any contacts linked to this user (cascades to projects, quotes, invoices, messages)
    const { error: deleteContactError } = await adminSupabase
      .from("contacts")
      .delete()
      .eq("user_id", id)

    if (deleteContactError) {
      console.error("Error deleting contacts:", deleteContactError)
      // Continue - we still want to delete the auth user
    }

    // Also delete any projects directly linked to this user (not through contacts)
    const { error: deleteProjectsError } = await adminSupabase
      .from("projects")
      .delete()
      .eq("user_id", id)

    if (deleteProjectsError) {
      console.error("Error deleting projects:", deleteProjectsError)
      // Continue - we still want to delete the auth user
    }

    // Delete the auth user
    const { error: deleteUserError } = await adminSupabase.auth.admin.deleteUser(id)

    if (deleteUserError) {
      console.error("Error deleting auth user:", deleteUserError)
      return NextResponse.json(
        { error: "Failed to delete customer account" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Customer ${customerName} deleted`,
    })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
