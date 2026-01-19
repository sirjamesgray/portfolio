import { isCustomerDashboardEnabled } from "@/lib/feature-flags";
import { HomeClient } from "@/app/home-client";

export default async function HireLandingPage() {
  const customerDashboardEnabled = await isCustomerDashboardEnabled();
  return <HomeClient customerDashboardEnabled={customerDashboardEnabled} />;
}
