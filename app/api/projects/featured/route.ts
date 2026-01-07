import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  // Fetch projects that are shown on landing page (admin enabled AND customer hasn't opted out)
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      public_title,
      public_description,
      public_hero_image,
      public_industry,
      project_type,
      vercel_url
    `)
    .eq("show_on_landing_page", true)
    .or("customer_opted_out_of_landing_page.is.null,customer_opted_out_of_landing_page.eq.false")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching featured projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }

  return NextResponse.json({ projects: projects || [] })
}
