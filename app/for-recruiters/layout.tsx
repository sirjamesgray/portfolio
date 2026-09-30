import type { Metadata } from "next";
import { careerMetadata } from "@/lib/career-meta";

export const metadata: Metadata = careerMetadata({
  title: "For recruiters | Jamie Gray",
  description:
    "Notes on public product work for recruiters: WeWrite, Lucent Wash, Worx4u, and earlier design roles.",
  path: "/for-recruiters",
});

export default function ForRecruitersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
