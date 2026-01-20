import { Metadata } from "next";
import { isCustomerDashboardEnabled } from "@/lib/feature-flags";
import { HomeClient } from "@/app/home-client";

export const metadata: Metadata = {
  title: "Need a new website? | Jamie Gray",
  description: "Custom websites and admin tools for small businesses. I build fast, beautiful, modern websites that help you work smarter and grow faster.",
  openGraph: {
    title: "Need a new website? | Jamie Gray",
    description: "Custom websites and admin tools for small businesses. I build fast, beautiful, modern websites that help you work smarter and grow faster.",
    url: "https://www.jamiegray.net/landing/book-a-project",
    siteName: "Jamie Gray",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Need a new website? | Jamie Gray",
    description: "Custom websites and admin tools for small businesses.",
    creator: "@jamiegraytech",
  },
};

export default async function BookAProjectLandingPage() {
  const customerDashboardEnabled = await isCustomerDashboardEnabled();
  return <HomeClient customerDashboardEnabled={customerDashboardEnabled} />;
}
