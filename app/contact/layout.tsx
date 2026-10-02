import type { Metadata } from "next";
import { careerMetadata } from "@/lib/career-meta";

export const metadata: Metadata = careerMetadata({
  title: "Contact | Jamie Gray",
  description:
    "Email contact@jamiegray.net or connect on LinkedIn. Fort Worth, remote or DFW.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
