import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()

  // Fetch projects enabled for the design systems section
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      public_title,
      public_description,
      design_system_description,
      icon_url,
      public_brand_color,
      public_design_system_url,
      design_system_image_url
    `)
    .eq("show_in_design_systems_section", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching design system projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }

  return NextResponse.json({ projects: projects || [] })
}
