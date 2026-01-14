import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  // Use admin client to bypass RLS - this is a public endpoint for featured projects
  const supabase = createAdminClient()

  // Fetch projects that admin has enabled for landing page
  // Note: customer_opted_out_of_landing_page is informational only for admin awareness
  // Admin has final say on what's shown
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
      vercel_url,
      icon_url,
      public_brand_color,
      public_live_url,
      show_live_link,
      public_design_system_url,
      show_design_system_link,
      public_content_html
    `)
    .eq("show_on_landing_page", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching featured projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }

  return NextResponse.json({ projects: projects || [] })
}
