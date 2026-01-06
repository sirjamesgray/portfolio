import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe, getWebhookSecret } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    console.error("Stripe webhook: Missing signature")
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, getWebhookSecret())
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error(`Stripe webhook signature verification failed: ${message}`)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case "invoice.finalized": {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`Invoice finalized: ${invoice.id}`)

        // Update our invoice record with the hosted invoice URL
        if (invoice.metadata?.invoice_id) {
          await supabase
            .from("invoices")
            .update({
              status: "sent",
              invoice_url: invoice.hosted_invoice_url,
              invoice_pdf: invoice.invoice_pdf,
            })
            .eq("id", invoice.metadata.invoice_id)
        }
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`Invoice paid: ${invoice.id}`)

        const invoiceId = invoice.metadata?.invoice_id
        const projectId = invoice.metadata?.project_id
        const now = new Date().toISOString()
        const amountPaid = (invoice.amount_paid || 0) / 100 // Convert from cents

        // Update our invoice record with paid status and timestamp
        if (invoiceId) {
          await supabase
            .from("invoices")
            .update({
              status: "paid",
              paid_at: now,
              amount_paid: amountPaid,
            })
            .eq("id", invoiceId)
        }

        // Update project amount_paid
        if (projectId) {
          // Get current project amount_paid and add this payment
          const { data: project } = await supabase
            .from("projects")
            .select("amount_paid")
            .eq("id", projectId)
            .single()

          const currentAmountPaid = project?.amount_paid || 0
          const newAmountPaid = currentAmountPaid + amountPaid

          await supabase
            .from("projects")
            .update({
              amount_paid: newAmountPaid,
              updated_at: now,
            })
            .eq("id", projectId)

          // Log activity
          const formattedAmount = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amountPaid)

          await supabase.from("activity_log").insert({
            project_id: projectId,
            action: "invoice_paid",
            details: `Invoice paid: ${formattedAmount}`,
          })
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        console.error(`Invoice payment failed: ${invoice.id}`)

        // Update our invoice record
        if (invoice.metadata?.invoice_id) {
          await supabase
            .from("invoices")
            .update({ status: "overdue" })
            .eq("id", invoice.metadata.invoice_id)
        }
        break
      }

      case "invoice.voided": {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`Invoice voided: ${invoice.id}`)

        // Update our invoice record
        if (invoice.metadata?.invoice_id) {
          await supabase
            .from("invoices")
            .update({ status: "canceled" })
            .eq("id", invoice.metadata.invoice_id)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
