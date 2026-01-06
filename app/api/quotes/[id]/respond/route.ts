import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { stripe, formatAmountForStripe } from "@/lib/stripe"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: quoteId } = await params
  const { action, message } = await request.json()

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
      description,
      projects!inner (
        id,
        title,
        user_id,
        stripe_customer_id
      )
    `)
    .eq("id", quoteId)
    .single()

  if (quoteError || !quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 })
  }

  // Verify the user owns the project
  const projectData = quote.projects as unknown as {
    id: string
    title: string | null
    user_id: string
    stripe_customer_id: string | null
  }
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

    // Create Stripe invoice
    try {
      const adminSupabase = createAdminClient()

      // Get or create Stripe customer
      let stripeCustomerId = projectData.stripe_customer_id

      if (!stripeCustomerId) {
        // Create a new Stripe customer
        const stripeCustomer = await stripe.customers.create({
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split("@")[0],
          metadata: {
            user_id: user.id,
          },
        })
        stripeCustomerId = stripeCustomer.id

        // Save Stripe customer ID to project
        await adminSupabase
          .from("projects")
          .update({ stripe_customer_id: stripeCustomerId })
          .eq("id", quote.project_id)
      }

      // Create invoice record in our database first
      const { data: invoiceRecord, error: invoiceError } = await adminSupabase
        .from("invoices")
        .insert({
          project_id: quote.project_id,
          quote_id: quoteId,
          amount: quote.amount,
          status: "draft",
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        })
        .select("id")
        .single()

      if (invoiceError || !invoiceRecord) {
        console.error("Failed to create invoice record:", invoiceError)
        throw new Error("Failed to create invoice record")
      }

      // Create Stripe invoice
      const stripeInvoice = await stripe.invoices.create({
        customer: stripeCustomerId,
        collection_method: "send_invoice",
        days_until_due: 14,
        metadata: {
          invoice_id: invoiceRecord.id,
          project_id: quote.project_id,
          quote_id: quoteId,
        },
      })

      // Add line item to invoice
      await stripe.invoiceItems.create({
        customer: stripeCustomerId,
        invoice: stripeInvoice.id,
        amount: formatAmountForStripe(Number(quote.amount)),
        currency: "usd",
        description: projectData.title
          ? `Web Development: ${projectData.title}`
          : quote.description || "Web Development Services",
      })

      // Finalize and send the invoice
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id)
      await stripe.invoices.sendInvoice(stripeInvoice.id)

      // Update our invoice record with Stripe details
      await adminSupabase
        .from("invoices")
        .update({
          stripe_invoice_id: stripeInvoice.id,
          invoice_url: finalizedInvoice.hosted_invoice_url,
          invoice_pdf: finalizedInvoice.invoice_pdf,
          status: "sent",
        })
        .eq("id", invoiceRecord.id)

      // Log invoice creation
      await supabase.from("activity_log").insert({
        project_id: quote.project_id,
        action: "invoice_sent",
        details: `Invoice sent for ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Number(quote.amount))}`,
      })
    } catch (stripeError) {
      console.error("Failed to create Stripe invoice:", stripeError)
      // Don't fail the quote acceptance if Stripe fails
      // The admin can manually create an invoice later
    }

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

    // Log activity with optional message
    const details = message
      ? `Quote was declined by the customer. Feedback: "${message}"`
      : "Quote was declined by the customer"

    await supabase.from("activity_log").insert({
      project_id: quote.project_id,
      action: "quote_rejected",
      details,
    })

    return NextResponse.json({
      success: true,
      message: "Quote declined",
    })
  }
}
