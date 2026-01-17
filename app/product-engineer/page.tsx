import { Metadata } from "next";
import { DeleteFigmaLanding } from "../landing-pages/delete-figma";

export const metadata: Metadata = {
  title: "Product Engineer | Jamie Gray",
  description: "I collapse design and front-end engineering into a single role. Code is the source of truth. Looking for a full-time Product Engineer role.",
  openGraph: {
    title: "Product Engineer | Jamie Gray",
    description: "I collapse design and front-end engineering into a single role. Code is the source of truth.",
  },
};

export default function ProductEngineerPage() {
  // This landing page doesn't use the customer dashboard flow
  return <DeleteFigmaLanding />;
}
