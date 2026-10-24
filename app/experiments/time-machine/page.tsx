import { ArrowLeft } from "lucide-react";
import { CareerShell } from "@/components/career-shell";
import { CareerButton } from "@/components/career-button";
import { TimeMachine } from "@/components/time-machine";

export default function TimeMachineExperiment() {
  return (
    <CareerShell width="max-w-6xl">
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand/40 pb-4">
          <div>
            <p className="font-mono text-xs text-brand">SPECIMEN 05 // CHRONO DECK</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Time Machine</h1>
          </div>
          <CareerButton variant="secondary" size="sm" icon={ArrowLeft} href="/experiments">
            Back to Experiments
          </CareerButton>
        </div>

        <div className="border border-brand/40 bg-black">
          <TimeMachine />
        </div>
      </div>
    </CareerShell>
  );
}
