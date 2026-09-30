import { Metadata } from "next";
import { isCustomerDashboardEnabled } from "@/lib/feature-flags";
import { ProductEngineerLanding } from "@/app/landing-pages/product-engineer";

export const metadata: Metadata = {
  title: "Product Engineer | Jamie Gray",
  description: "I design in code and ship real products with AI agents. Open to senior product and design engineering conversations.",
  openGraph: {
    title: "Product Engineer | Jamie Gray",
    description: "I collapse design and front-end engineering into a single role. Code is the source of truth.",
    url: "https://www.jamiegray.net/landing/product-engineer",
    siteName: "Jamie Gray",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Engineer | Jamie Gray",
    description: "I collapse design and front-end engineering into a single role. Code is the source of truth.",
    creator: "@jamiegraytech",
  },
};

export default async function ProductEngineerLandingPage() {
  const customerDashboardEnabled = await isCustomerDashboardEnabled();
  return <ProductEngineerLanding customerDashboardEnabled={customerDashboardEnabled} />;
}
