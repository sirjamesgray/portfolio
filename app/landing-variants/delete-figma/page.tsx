import { isCustomerDashboardEnabled } from "@/lib/feature-flags";
import { DeleteFigmaLanding } from "@/app/landing-pages/delete-figma";

export default async function DeleteFigmaLandingPage() {
  const customerDashboardEnabled = await isCustomerDashboardEnabled();
  return <DeleteFigmaLanding customerDashboardEnabled={customerDashboardEnabled} />;
}
