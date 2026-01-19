import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"
import DOMPurify from "isomorphic-dompurify"

// Sanitize HTML content to prevent XSS
function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "a", "img", "blockquote", "code", "pre", "span", "div"],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "style", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  })
}

// GET - List all content blocks for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const adminSupabase = createAdminClient()

  const { data: blocks, error } = await adminSupabase
    .from("project_content_blocks")
    .select("*")
    .eq("project_id", projectId)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching content blocks:", error)
    return NextResponse.json({ error: "Failed to fetch content blocks" }, { status: 500 })
  }

  return NextResponse.json({ blocks: blocks || [] })
}

// POST - Create a new content block
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { type, content, image_alt } = body

  if (!type || !content) {
    return NextResponse.json({ error: "Type and content are required" }, { status: 400 })
  }

  // Sanitize HTML content to prevent XSS
  const sanitizedContent = type === "html" || type === "text" ? sanitizeHtml(content) : content

  const adminSupabase = createAdminClient()

  // Get the max display_order for this project
  const { data: maxOrder } = await adminSupabase
    .from("project_content_blocks")
    .select("display_order")
    .eq("project_id", projectId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single()

  const displayOrder = (maxOrder?.display_order || 0) + 1

  const { data: block, error } = await adminSupabase
    .from("project_content_blocks")
    .insert({
      project_id: projectId,
      type,
      content: sanitizedContent,
      image_alt,
      display_order: displayOrder,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating content block:", error)
    return NextResponse.json({ error: "Failed to create content block" }, { status: 500 })
  }

  return NextResponse.json({ block })
}

// PATCH - Update project metadata, content HTML, or reorder blocks
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { public_title, public_description, public_hero_image, public_industry, public_content_html, public_brand_color, icon_url, design_system_image_url, design_system_description, reorder } = body

  const adminSupabase = createAdminClient()

  // Handle reordering (legacy block system)
  if (reorder && Array.isArray(reorder)) {
    for (let i = 0; i < reorder.length; i++) {
      await adminSupabase
        .from("project_content_blocks")
        .update({ display_order: i, updated_at: new Date().toISOString() })
        .eq("id", reorder[i])
        .eq("project_id", projectId)
    }
    return NextResponse.json({ success: true })
  }

  // Update project metadata (with sanitization for HTML fields)
  const updates: Record<string, unknown> = {}
  if (public_title !== undefined) updates.public_title = public_title
  if (public_description !== undefined) updates.public_description = sanitizeHtml(public_description)
  if (public_hero_image !== undefined) updates.public_hero_image = public_hero_image
  if (public_industry !== undefined) updates.public_industry = public_industry
  if (public_content_html !== undefined) updates.public_content_html = sanitizeHtml(public_content_html)
  if (public_brand_color !== undefined) updates.public_brand_color = public_brand_color
  if (icon_url !== undefined) updates.icon_url = icon_url
  if (design_system_image_url !== undefined) updates.design_system_image_url = design_system_image_url
  if (design_system_description !== undefined) updates.design_system_description = design_system_description

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 })
  }

  const { data: project, error } = await adminSupabase
    .from("projects")
    .update(updates)
    .eq("id", projectId)
    .select()
    .single()

  if (error) {
    console.error("Error updating project metadata:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }

  return NextResponse.json({ project })
}
