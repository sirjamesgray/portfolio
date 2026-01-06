import { createClient } from "@supabase/supabase-js"

// Bun automatically loads .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function main() {
  console.log("Creating test user...")

  // Create a test user
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: "testuser@example.com",
    email_confirm: true,
    user_metadata: {
      full_name: "Test User",
    },
  })

  if (userError) {
    if (userError.message.includes("already been registered")) {
      console.log("Test user already exists, fetching...")
      const { data: users } = await supabase.auth.admin.listUsers()
      const existingUser = users.users.find((u) => u.email === "testuser@example.com")
      if (existingUser) {
        console.log("Found existing test user:", existingUser.id)
        await createProjectsForUser(existingUser.id)
      }
    } else {
      console.error("Error creating user:", userError)
      process.exit(1)
    }
  } else {
    console.log("Created test user:", userData.user.id)
    await createProjectsForUser(userData.user.id)
  }

  console.log("Done!")
}

async function createProjectsForUser(userId: string) {
  console.log("Creating test projects for user:", userId)

  // First, create a contact for the user (required by foreign key)
  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .insert({
      name: "Test User",
      email: "testuser@example.com",
      user_id: userId,
    })
    .select()
    .single()

  if (contactError && !contactError.message.includes("duplicate")) {
    console.error("Error creating contact:", contactError)
  }

  // Get or use the contact
  let contactId = contact?.id
  if (!contactId) {
    const { data: existingContact } = await supabase
      .from("contacts")
      .select("id")
      .eq("email", "testuser@example.com")
      .single()
    contactId = existingContact?.id
  }

  if (!contactId) {
    console.error("Could not get contact ID")
    return
  }

  // Create multiple test projects with different statuses
  const projects = [
    {
      user_id: userId,
      contact_id: contactId,
      project_type: "webapp",
      budget: "10k-25k",
      timeline: "2-3-months",
      status: "in_progress",
      description: "Building a SaaS dashboard for analytics tracking with real-time data visualization.",
    },
    {
      user_id: userId,
      contact_id: contactId,
      project_type: "website",
      budget: "5k-10k",
      timeline: "1-month",
      status: "lead",
      description: "Portfolio website redesign with modern animations and a blog section.",
    },
    {
      user_id: userId,
      contact_id: contactId,
      project_type: "ecommerce",
      budget: "25k-plus",
      timeline: "flexible",
      status: "contacted",
      description: "E-commerce platform for a boutique clothing brand with custom checkout flow.",
    },
  ]

  for (const project of projects) {
    const { error } = await supabase.from("projects").insert(project)
    if (error) {
      if (error.message.includes("duplicate")) {
        console.log("Project already exists, skipping...")
      } else {
        console.error("Error creating project:", error)
      }
    } else {
      console.log("Created project:", project.project_type)
    }
  }
}

main()
