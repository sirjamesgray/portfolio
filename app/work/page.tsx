import type { Metadata } from "next";
import { CareerShell } from "@/components/career-shell";
import { WorkAndDesign } from "@/components/career-landing";
import { WorkFocusRestore } from "@/components/work-modal";
import { careerMetadata } from "@/lib/career-meta";

export const metadata: Metadata = careerMetadata({
  title: "Work | Jamie Gray",
  description: "WeWrite, Lucent Wash, and client work from Turbo. Product engineering and design by Jamie Gray.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <CareerShell bare>
      <WorkFocusRestore />
      <WorkAndDesign page />
    </CareerShell>
  );
}
