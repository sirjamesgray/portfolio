import type { Metadata } from "next";
import { CareerShell } from "@/components/career-shell";
import { LabSection } from "@/components/career-landing";
import { careerMetadata } from "@/lib/career-meta";

export const metadata: Metadata = careerMetadata({
  title: "Lab | Jamie Gray",
  description: "Builder log: small tools, a type migration, and the path from prompt to ship.",
  path: "/lab",
});

export default function LabPage() {
  return (
    <CareerShell bare>
      <LabSection />
    </CareerShell>
  );
}
