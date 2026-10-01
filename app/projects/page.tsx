import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { WorkAndDesign } from "@/components/career-landing";
import { careerMetadata } from "@/lib/career-meta";

export const metadata: Metadata = careerMetadata({
  title: "Product work | Jamie Gray",
  description:
    "Public product work: WeWrite, Lucent Wash, Worx4u, and Turbo Design Agency clients Ramp, Vondy, and Precision AI, plus Whop and ParkHub.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader landingPage="career" customerDashboardEnabled={false} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6">
        <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Back to home
        </Link>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
          Product work
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Products I design in code and ship. WeWrite and Lucent Wash are live. Worx4u is the day job, in text only. Turbo Design Agency covers Ramp, Vondy, and Precision AI.
        </p>
        <div className="mt-12">
          <WorkAndDesign />
        </div>
      </main>
      <Footer />
    </div>
  );
}
