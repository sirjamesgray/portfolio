import type { Metadata } from "next";
import { careerMetadata } from "@/lib/career-meta";

export const metadata: Metadata = careerMetadata({
  title: "Experience | Jamie Gray",
  description:
    "8+ years of product engineering and design across startups, agencies, and enterprise. Fort Worth. Remote or DFW.",
  path: "/experience",
});

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
