import { Metadata } from "next";
import { PricingPageClient } from "./client";
import { isCustomerDashboardEnabled } from "@/lib/feature-flags";

export const metadata: Metadata = {
  title: "Pricing | Jamie Gray",
  description: "Simple, transparent pricing for your website project. No hidden fees, no surprises.",
};

export default async function PricingPage() {
  const customerDashboardEnabled = await isCustomerDashboardEnabled();

  return <PricingPageClient customerDashboardEnabled={customerDashboardEnabled} />;
}
