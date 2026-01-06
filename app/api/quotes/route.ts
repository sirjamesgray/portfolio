import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const {
    projectId,
    title,
    description,
    amount,
    lineItems,
    terms,
    validDays = 14,
    sendImmediately = false,
  } = body

  // Validate required fields
  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 }
    )
  }

  if (!title || title.trim().length === 0) {
    return NextResponse.json(
      { error: "Quote title is required" },
      { status: 400 }
    )
  }

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "A valid amount is required" },
      { status: 400 }
    )
  }

  const adminSupabase = createAdminClient()

  // Verify project exists
  const { data: project, error: projectError } = await adminSupabase
    .from("projects")
    .select("id, title, user_id")
    .eq("id", projectId)
    .single()

  if (projectError || !project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    )
  }

  const now = new Date()
  const validUntil = new Date(now.getTime() + validDays * 24 * 60 * 60 * 1000)

  // Create the quote
  const { data: quote, error: quoteError } = await adminSupabase
    .from("quotes")
    .insert({
      project_id: projectId,
      title: title.trim(),
      description: description?.trim() || null,
      amount,
      line_items: lineItems || [],
      terms: terms?.trim() || null,
      valid_until: validUntil.toISOString(),
      status: sendImmediately ? "sent" : "draft",
      sent_at: sendImmediately ? now.toISOString() : null,
    })
    .select("id")
    .single()

  if (quoteError) {
    console.error("Error creating quote:", quoteError)
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    )
  }

  // Log activity
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)

  await adminSupabase.from("activity_log").insert({
    project_id: projectId,
    action: sendImmediately ? "quote_sent" : "quote_created",
    details: sendImmediately
      ? `Quote "${title}" sent for ${formattedAmount}`
      : `Quote "${title}" created for ${formattedAmount} (draft)`,
  })

  // If sending immediately and project has a user, update project status
  if (sendImmediately && project.user_id) {
    await adminSupabase
      .from("projects")
      .update({
        status: "contacted",
        updated_at: now.toISOString(),
      })
      .eq("id", projectId)
      .eq("status", "lead") // Only update if still in lead status
  }

  return NextResponse.json({
    success: true,
    quoteId: quote.id,
    message: sendImmediately ? "Quote sent successfully" : "Quote saved as draft",
  })
}
