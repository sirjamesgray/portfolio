import type { Metadata } from "next";

// The recruiter area stays out of search. The X-Robots-Tag header in next.config.ts matches this tag.
export const metadata: Metadata = {
  title: "Recruiters | Jamie Gray",
  description: "Private notes for recruiters.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function RecruitersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
