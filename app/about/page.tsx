import type { Metadata } from "next";
import { careerMetadata } from "@/lib/career-meta";
import { AboutContent } from "@/components/about-content";

export const metadata: Metadata = careerMetadata({
  title: "About | Jamie Gray",
  description:
    "Full Stack Developer, previously a Product Designer, in Fort Worth. 8+ years across startups, agencies, and enterprise.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutContent title="About" />;
}
