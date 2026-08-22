import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { hashPassword } from "@/lib/recruiter-auth"

// GET: List all recruiter passwords
export async function GET() {
  try {
    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from("recruiter_passwords")
      .select("id, label, is_active, created_at, updated_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching recruiter passwords:", error)
      return NextResponse.json(
        { error: "Failed to fetch passwords" },
        { status: 500 }
      )
    }

    return NextResponse.json({ passwords: data })
  } catch (err) {
    console.error("Admin recruiter passwords error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST: Create a new recruiter password
export async function POST(request: NextRequest) {
  try {
    const { label, password } = await request.json()

    if (!label || !password) {
      return NextResponse.json(
        { error: "Label and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()
    const { hash, salt } = hashPassword(password)

    const { data, error } = await adminClient
      .from("recruiter_passwords")
      .insert({
        label,
        password_hash: hash,
        password_salt: salt,
      })
      .select("id, label, is_active, created_at")
      .single()

    if (error) {
      console.error("Error creating password:", error)
      return NextResponse.json(
        { error: "Failed to create password" },
        { status: 500 }
      )
    }

    return NextResponse.json({ password: data }, { status: 201 })
  } catch (err) {
    console.error("Admin create password error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH: Toggle active/inactive or update a password
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const adminClient = createAdminClient()

    if (body.action === "toggle-active" && body.id) {
      // Get current state first
      const { data: current } = await adminClient
        .from("recruiter_passwords")
        .select("is_active")
        .eq("id", body.id)
        .single()

      if (!current) {
        return NextResponse.json(
          { error: "Password not found" },
          { status: 404 }
        )
      }

      const { error } = await adminClient
        .from("recruiter_passwords")
        .update({ is_active: !current.is_active })
        .eq("id", body.id)

      if (error) {
        return NextResponse.json(
          { error: "Failed to update password" },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    if (body.action === "delete" && body.id) {
      const { error } = await adminClient
        .from("recruiter_passwords")
        .delete()
        .eq("id", body.id)

      if (error) {
        return NextResponse.json(
          { error: "Failed to delete password" },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (err) {
    console.error("Admin update password error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}