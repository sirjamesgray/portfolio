import { Metadata } from "next";
import { isCustomerDashboardEnabled } from "@/lib/feature-flags";
import { CAREER_DESCRIPTION, CAREER_TITLE, careerMetadata } from "@/lib/career-meta";
import { HomeClient } from "./home-client";

const CAREER_HOME = careerMetadata({
  title: CAREER_TITLE,
  description: CAREER_DESCRIPTION,
});

const PREVIEW_METADATA: Record<string, Metadata> = {
  "product-engineer": {
    title: "Product Engineer | Jamie Gray",
    description:
      "I design in code and ship real products with AI agents. Open to senior product and design engineering conversations.",
    openGraph: {
      title: "Product Engineer | Jamie Gray",
      description: "I design in code and ship real products with AI agents.",
      url: "https://www.jamiegray.net",
    },
  },
  "book-a-project": {
    title: "Book a project | Jamie Gray",
    description: "Custom websites and admin tools. The career page is the home page. This preview keeps the older project offer.",
    openGraph: {
      title: "Book a project | Jamie Gray",
      description: "Custom websites and admin tools.",
      url: "https://www.jamiegray.net",
    },
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  if (params.preview && PREVIEW_METADATA[params.preview]) {
    return PREVIEW_METADATA[params.preview];
  }
  return CAREER_HOME;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>
}) {
  const params = await searchParams;

  // The feature-flag picker stays for ?preview=. Home on this branch is the career page.
  const preview = params.preview;

  if (preview === "product-engineer" || preview === "book-a-project") {
    const customerDashboardEnabled = await isCustomerDashboardEnabled();
    if (preview === "product-engineer") {
      const { ProductEngineerLanding } = await import("./landing-pages/product-engineer");
      return <ProductEngineerLanding customerDashboardEnabled={customerDashboardEnabled} />;
    }
    return <HomeClient customerDashboardEnabled={customerDashboardEnabled} />;
  }

  const { CareerLanding } = await import("@/components/career-landing");
  return <CareerLanding />;
}
