import { isCustomerDashboardEnabled } from "@/lib/feature-flags";
import { ProductEngineerLanding } from "@/app/landing-pages/product-engineer";

export default async function ProductEngineerLandingPage() {
  const customerDashboardEnabled = await isCustomerDashboardEnabled();
  return <ProductEngineerLanding customerDashboardEnabled={customerDashboardEnabled} />;
}
