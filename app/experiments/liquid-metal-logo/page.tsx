import { ArrowLeft } from "lucide-react";
import { CareerShell } from "@/components/career-shell";
import { CareerButton } from "@/components/career-button";
import { LiquidMetalLogo } from "@/components/liquid-metal-logo";

const presets = [
  { name: "Emerald Chrome", colorTint: "#3dd68c", repetition: 5, softness: 0.3 },
  { name: "Pure Chrome", colorTint: "#ffffff", repetition: 4, softness: 0.1 },
  { name: "Cobalt Alloy", colorTint: "#70b8ff", repetition: 6, softness: 0.25 },
  { name: "High Ripples", colorTint: "#3dd68c", repetition: 9, softness: 0.2 },
];

export default function LiquidMetalLogoExperiment() {
  return (
    <CareerShell width="max-w-6xl">
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand/40 pb-4">
          <div>
            <p className="font-mono text-xs text-brand">SPECIMEN 03 // WEBGL SHADER</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Liquid Metal Logo</h1>
          </div>
          <CareerButton variant="secondary" size="sm" icon={ArrowLeft} href="/experiments">
            Back to Experiments
          </CareerButton>
        </div>

        <section className="grid gap-6 sm:grid-cols-2">
          {presets.map((preset) => (
            <div
              key={preset.name}
              className="flex flex-col items-center justify-between gap-4 border border-brand/40 bg-black p-6"
            >
              <div className="w-full flex items-center justify-between border-b border-white/15 pb-2 font-mono text-xs">
                <span className="text-[#70b8ff]">{preset.name}</span>
                <span className="text-muted-foreground">{preset.repetition}x RIPPLES</span>
              </div>
              <LiquidMetalLogo
                size={200}
                colorTint={preset.colorTint}
                repetition={preset.repetition}
                softness={preset.softness}
              />
            </div>
          ))}
        </section>
      </div>
    </CareerShell>
  );
}
