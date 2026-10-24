"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { CareerShell } from "@/components/career-shell";
import { CareerButton } from "@/components/career-button";
import { UIShowcase, type ShowcaseStyle } from "@/components/ui-showcase";
import { UIStyleSwitcher } from "@/components/ui-style-switcher";

export default function UIShowcaseExperiment() {
  const [selectedStyle, setSelectedStyle] = useState<ShowcaseStyle>("neon");

  return (
    <CareerShell width="max-w-6xl">
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand/40 pb-4">
          <div>
            <p className="font-mono text-xs text-brand">SPECIMEN 04 // UI COMPONENT SYSTEM</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">UI Showcase</h1>
          </div>
          <CareerButton variant="secondary" size="sm" icon={ArrowLeft} href="/experiments">
            Back to Experiments
          </CareerButton>
        </div>

        <div className="border border-brand/40 bg-black p-4">
          <UIStyleSwitcher activeStyle={selectedStyle} onStyleChange={setSelectedStyle} />
          <div className="mt-4 overflow-hidden border border-white/15 bg-black">
            <UIShowcase style={selectedStyle} />
          </div>
        </div>
      </div>
    </CareerShell>
  );
}
