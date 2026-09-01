import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-08-26.dahlia",
  typescript: true,
})

// Get the appropriate webhook secret based on environment
export function getWebhookSecret(): string {
  const isDev = process.env.NODE_ENV === "development"

  if (isDev && process.env.STRIPE_WEBHOOK_SECRET_LOCAL) {
    return process.env.STRIPE_WEBHOOK_SECRET_LOCAL
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable")
  }

  return process.env.STRIPE_WEBHOOK_SECRET
}

// Helper to format amount for Stripe (converts dollars to cents)
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100)
}

// Helper to format amount from Stripe (converts cents to dollars)
export function formatAmountFromStripe(amount: number): number {
  return amount / 100
}
