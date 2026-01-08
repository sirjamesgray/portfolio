import { Metadata } from "next";
import { PricingPageClient } from "./client";

export const metadata: Metadata = {
  title: "Pricing | Jamie Gray",
  description: "Sprint-based web development. Ship fast with fixed-price packages.",
};

export default function PricingPage() {
  return <PricingPageClient />;
}
