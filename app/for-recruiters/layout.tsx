import type { Metadata } from "next";
import { careerMetadata } from "@/lib/career-meta";

export const metadata: Metadata = careerMetadata({
  title: "For recruiters | Jamie Gray",
  description:
    "I build software that lets people earn from their own work. Notes for recruiters on WeWrite, Lucent Wash, and the rest of the public work.",
  path: "/for-recruiters",
});

export default function ForRecruitersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
