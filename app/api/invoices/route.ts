import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"
import { stripe, formatAmountForStripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const {
    projectId,
    amount,
    description,
    sendImmediately = false,
  } = body

  // Validate required fields
  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is required" },
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

  // Get project with contact info
  const { data: project, error: projectError } = await adminSupabase
    .from("projects")
    .select(`
      id,
      title,
      user_id,
      contacts (
        name,
        email
      )
    `)
    .eq("id", projectId)
    .single()

  if (projectError || !project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    )
  }

  const contact = Array.isArray(project.contacts)
    ? project.contacts[0]
    : project.contacts

  // Create the invoice record in our database
  const { data: invoice, error: invoiceError } = await adminSupabase
    .from("invoices")
    .insert({
      project_id: projectId,
      amount,
      status: sendImmediately ? "pending" : "draft",
    })
    .select("id")
    .single()

  if (invoiceError) {
    console.error("Error creating invoice:", invoiceError)
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    )
  }

  // If sending immediately, create and send via Stripe
  if (sendImmediately && contact?.email) {
    try {
      // Find or create a Stripe customer
      const customers = await stripe.customers.list({
        email: contact.email,
        limit: 1,
      })

      let customerId: string
      if (customers.data.length > 0) {
        customerId = customers.data[0].id
      } else {
        const customer = await stripe.customers.create({
          email: contact.email,
          name: contact.name || undefined,
          metadata: {
            project_id: projectId,
          },
        })
        customerId = customer.id
      }

      // Create the Stripe invoice
      const stripeInvoice = await stripe.invoices.create({
        customer: customerId,
        collection_method: "send_invoice",
        days_until_due: 14,
        metadata: {
          invoice_id: invoice.id,
          project_id: projectId,
        },
      })

      // Add an invoice item
      await stripe.invoiceItems.create({
        customer: customerId,
        invoice: stripeInvoice.id,
        amount: formatAmountForStripe(amount),
        currency: "usd",
        description: description || project.title || "Web Development Services",
      })

      // Finalize and send the invoice
      await stripe.invoices.finalizeInvoice(stripeInvoice.id)
      await stripe.invoices.sendInvoice(stripeInvoice.id)

      // Update our invoice record with Stripe details
      await adminSupabase
        .from("invoices")
        .update({
          status: "sent",
          stripe_invoice_id: stripeInvoice.id,
        })
        .eq("id", invoice.id)

    } catch (stripeError) {
      console.error("Error creating Stripe invoice:", stripeError)
      // Invoice was created in our DB but Stripe failed, update status
      await adminSupabase
        .from("invoices")
        .update({ status: "draft" })
        .eq("id", invoice.id)

      return NextResponse.json(
        { error: "Failed to send invoice via Stripe" },
        { status: 500 }
      )
    }
  }

  // Log activity
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)

  await adminSupabase.from("activity_log").insert({
    project_id: projectId,
    action: sendImmediately ? "invoice_sent" : "invoice_created",
    details: sendImmediately
      ? `Invoice sent for ${formattedAmount}`
      : `Invoice created for ${formattedAmount} (draft)`,
  })

  return NextResponse.json({
    success: true,
    invoiceId: invoice.id,
    message: sendImmediately ? "Invoice sent successfully" : "Invoice saved as draft",
  })
}
