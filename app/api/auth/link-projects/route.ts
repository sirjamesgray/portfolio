import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// This endpoint links any existing projects (created via Calendly) to the authenticated user
// Called after successful login/signup

export async function POST() {
  try {
    const cookieStore = await cookies()

    // Get the authenticated user
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Use admin client to bypass RLS for linking
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const userEmail = user.email
    if (!userEmail) {
      return NextResponse.json({ error: "No email on user" }, { status: 400 })
    }

    // Find contacts with matching email that aren't linked to a user yet
    const { data: contacts, error: contactError } = await supabaseAdmin
      .from("contacts")
      .select("id")
      .eq("email", userEmail)
      .is("user_id", null)

    if (contactError) {
      console.error("Error finding contacts:", contactError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ linked: 0, message: "No unlinked projects found" })
    }

    const contactIds = contacts.map(c => c.id)

    // Link contacts to user
    const { error: updateContactError } = await supabaseAdmin
      .from("contacts")
      .update({ user_id: user.id })
      .in("id", contactIds)

    if (updateContactError) {
      console.error("Error linking contacts:", updateContactError)
    }

    // Find projects with these contact_ids that don't have a user_id yet
    const { data: projects, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("id")
      .in("contact_id", contactIds)
      .is("user_id", null)

    if (projectError) {
      console.error("Error finding projects:", projectError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (!projects || projects.length === 0) {
      return NextResponse.json({ linked: 0, message: "No unlinked projects found" })
    }

    const projectIds = projects.map(p => p.id)

    // Update projects with user_id
    const { error: updateError } = await supabaseAdmin
      .from("projects")
      .update({ user_id: user.id })
      .in("id", projectIds)

    if (updateError) {
      console.error("Error updating projects:", updateError)
      return NextResponse.json({ error: "Failed to link projects" }, { status: 500 })
    }

    // Add user as owner in project_members for each project
    const memberInserts = projectIds.map(projectId => ({
      project_id: projectId,
      user_id: user.id,
      role: "owner" as const,
    }))

    const { error: memberError } = await supabaseAdmin
      .from("project_members")
      .upsert(memberInserts, { onConflict: "project_id,user_id" })

    if (memberError) {
      console.error("Error adding project members:", memberError)
      // Non-fatal, projects are still linked
    }

    // Log activity for each linked project
    for (const projectId of projectIds) {
      await supabaseAdmin.from("activity_log").insert({
        project_id: projectId,
        action: "user_linked",
        details: {
          user_id: user.id,
          email: userEmail,
        },
      })
    }

    console.log("Linked " + projectIds.length + " projects to user " + user.id)

    return NextResponse.json({
      linked: projectIds.length,
      projectIds,
      message: "Successfully linked " + projectIds.length + " project(s)",
    })
  } catch (error) {
    console.error("Link projects error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
