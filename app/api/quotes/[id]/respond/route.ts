import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: quoteId } = await params
  const { action } = await request.json()

  if (!["accept", "reject"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid action. Must be 'accept' or 'reject'" },
      { status: 400 }
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Fetch the quote and verify ownership
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .select(`
      id,
      project_id,
      amount,
      status,
      projects!inner (
        user_id
      )
    `)
    .eq("id", quoteId)
    .single()

  if (quoteError || !quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 })
  }

  // Verify the user owns the project
  const projectData = quote.projects as unknown as { user_id: string }
  if (projectData.user_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Check quote is in a respondable state
  if (quote.status !== "sent") {
    return NextResponse.json(
      { error: "Quote has already been responded to" },
      { status: 400 }
    )
  }

  const now = new Date().toISOString()

  if (action === "accept") {
    // Update quote status
    const { error: updateQuoteError } = await supabase
      .from("quotes")
      .update({
        status: "accepted",
        responded_at: now,
      })
      .eq("id", quoteId)

    if (updateQuoteError) {
      return NextResponse.json(
        { error: "Failed to update quote" },
        { status: 500 }
      )
    }

    // Update project with accepted quote and price
    const { error: updateProjectError } = await supabase
      .from("projects")
      .update({
        accepted_quote_id: quoteId,
        price: quote.amount,
        status: "in_progress",
        updated_at: now,
      })
      .eq("id", quote.project_id)

    if (updateProjectError) {
      return NextResponse.json(
        { error: "Failed to update project" },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from("activity_log").insert({
      project_id: quote.project_id,
      action: "quote_accepted",
      details: `Quote accepted for ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(quote.amount))}`,
    })

    // TODO: Create Stripe invoice here

    return NextResponse.json({
      success: true,
      message: "Quote accepted successfully",
    })
  } else {
    // Reject quote
    const { error: updateQuoteError } = await supabase
      .from("quotes")
      .update({
        status: "rejected",
        responded_at: now,
      })
      .eq("id", quoteId)

    if (updateQuoteError) {
      return NextResponse.json(
        { error: "Failed to update quote" },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from("activity_log").insert({
      project_id: quote.project_id,
      action: "quote_rejected",
      details: "Quote was declined by the customer",
    })

    return NextResponse.json({
      success: true,
      message: "Quote declined",
    })
  }
}
