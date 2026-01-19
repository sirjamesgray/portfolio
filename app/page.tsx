import { isCustomerDashboardEnabled, getActiveLandingPage } from "@/lib/feature-flags";
import { HomeClient } from "./home-client";

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
