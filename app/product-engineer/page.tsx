import { Metadata } from "next";
import { ProductEngineerLanding } from "../landing-pages/product-engineer";

export const metadata: Metadata = {
  title: "Product Engineer | Jamie Gray",
  description: "I collapse design and front-end engineering into a single role. Code is the source of truth. Looking for a full-time Product Engineer role.",
  openGraph: {
    title: "Product Engineer | Jamie Gray",
    description: "I collapse design and front-end engineering into a single role. Code is the source of truth.",
    url: "https://www.jamiegray.net/product-engineer",
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

export default function ProductEngineerPage() {
  // This landing page doesn't use the customer dashboard flow
  return <ProductEngineerLanding />;
}
