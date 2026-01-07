// Run with: bun scripts/cleanup-opted-out.ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log("Checking for projects with opted_out flag...")

  // First, let's see what we have
  const { data: optedOut, error: readError } = await supabase
    .from("projects")
    .select("id, title, customer_opted_out_of_landing_page")
    .eq("customer_opted_out_of_landing_page", true)

  if (readError) {
    console.error("Error reading:", readError)
    return
  }

  console.log(`Found ${optedOut?.length || 0} projects with opted_out = true`)
  optedOut?.forEach((p) => console.log(`  - ${p.title} (${p.id})`))

  if (!optedOut?.length) {
    console.log("Nothing to clean up!")
    return
  }

  // Clear the opted_out flag for all projects
  const { error: updateError, count } = await supabase
    .from("projects")
    .update({ customer_opted_out_of_landing_page: false })
    .eq("customer_opted_out_of_landing_page", true)

  if (updateError) {
    console.error("Error updating:", updateError)
    return
  }

  console.log(`\nCleared customer_opted_out_of_landing_page flag for all projects`)
}

main()
