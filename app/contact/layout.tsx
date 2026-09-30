import type { Metadata } from "next";
import { careerMetadata } from "@/lib/career-meta";

export const metadata: Metadata = careerMetadata({
  title: "Contact | Jamie Gray",
  description:
    "Open to senior product and design engineering conversations, remote or DFW. Email contact@jamiegray.net or connect on LinkedIn.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
