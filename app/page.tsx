import { isCustomerDashboardEnabled } from "@/lib/feature-flags";
import { HomeClient } from "./home-client";

export default async function Home() {
  const customerDashboardEnabled = await isCustomerDashboardEnabled();

  return <HomeClient customerDashboardEnabled={customerDashboardEnabled} />;
}
