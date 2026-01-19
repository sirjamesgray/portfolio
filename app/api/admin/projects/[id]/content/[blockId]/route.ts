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

// PATCH - Update a content block
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; blockId: string }> }
) {
  const { id: projectId, blockId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { type, content, image_alt } = body

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (type !== undefined) updates.type = type
  // Sanitize HTML content for text/html block types
  if (content !== undefined) {
    updates.content = (type === "html" || type === "text") ? sanitizeHtml(content) : content
  }
  if (image_alt !== undefined) updates.image_alt = image_alt

  const adminSupabase = createAdminClient()

  const { data: block, error } = await adminSupabase
    .from("project_content_blocks")
    .update(updates)
    .eq("id", blockId)
    .eq("project_id", projectId)
    .select()
    .single()

  if (error) {
    console.error("Error updating content block:", error)
    return NextResponse.json({ error: "Failed to update content block" }, { status: 500 })
  }

  return NextResponse.json({ block })
}

// DELETE - Delete a content block
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; blockId: string }> }
) {
  const { id: projectId, blockId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const adminSupabase = createAdminClient()

  const { error } = await adminSupabase
    .from("project_content_blocks")
    .delete()
    .eq("id", blockId)
    .eq("project_id", projectId)

  if (error) {
    console.error("Error deleting content block:", error)
    return NextResponse.json({ error: "Failed to delete content block" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
