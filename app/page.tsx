import { Metadata } from "next";
import { isCustomerDashboardEnabled, getActiveLandingPage } from "@/lib/feature-flags";
import { HomeClient } from "./home-client";

export async function generateMetadata(): Promise<Metadata> {
  const activeLandingPage = await getActiveLandingPage();

  if (activeLandingPage === "product-engineer") {
    return {
      title: "Product Engineer | Jamie Gray",
      description: "I collapse design and front-end engineering into a single role. Code is the source of truth. Looking for a full-time Product Engineer role.",
      openGraph: {
        title: "Product Engineer | Jamie Gray",
        description: "I collapse design and front-end engineering into a single role. Code is the source of truth.",
        url: "https://www.jamiegray.net",
      },
    };
  }

  // Default: Book a Project landing page
  return {
    title: "Need a new website? | Jamie Gray",
    description: "Custom websites and admin tools for small businesses. I build fast, beautiful, modern websites that help you work smarter and grow faster.",
    openGraph: {
      title: "Need a new website? | Jamie Gray",
      description: "Custom websites and admin tools for small businesses.",
      url: "https://www.jamiegray.net",
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>
}) {
  const params = await searchParams;
  const customerDashboardEnabled = await isCustomerDashboardEnabled();

  // Allow preview override via query param, otherwise use active landing page
  const activeLandingPage = params.preview || await getActiveLandingPage();

  // Render the appropriate landing page
  if (activeLandingPage === "product-engineer") {
    const { ProductEngineerLanding } = await import("./landing-pages/product-engineer");
    return <ProductEngineerLanding customerDashboardEnabled={customerDashboardEnabled} />;
  }

  // Default: Hire for Projects (current landing page)
  return <HomeClient customerDashboardEnabled={customerDashboardEnabled} />;
}
