import type { Metadata } from "next";
import { CareerShell } from "@/components/career-shell";
import { ExperimentsTrophyGrid } from "@/components/experiments-trophy-grid";

export const metadata: Metadata = {
  title: "Experiments | Jamie Gray",
  description:
    "Interactive apps, WebGL shaders, and autonomous control systems showcased inside live glass trophy cases.",
};

export default function ExperimentsPage() {
  return (
    <CareerShell width="max-w-7xl">
      <ExperimentsTrophyGrid />
    </CareerShell>
  );
}
