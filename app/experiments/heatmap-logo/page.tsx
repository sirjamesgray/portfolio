import { ArrowLeft } from "lucide-react";
import { CareerShell } from "@/components/career-shell";
import { CareerButton } from "@/components/career-button";
import { HeatmapLogo } from "@/components/heatmap-logo";

const colorPresets = [
  {
    name: "Thermal Emerald",
    colors: ["#052e16", "#10b981", "#3dd68c", "#70b8ff", "#ecfdf5"],
  },
  {
    name: "Solar Infrared",
    colors: ["#11206a", "#1f3ba2", "#2f63e7", "#6bd7ff", "#ffe679", "#ff991e", "#ff4c00"],
  },
  {
    name: "Cryo Cobalt",
    colors: ["#020617", "#1e3a8a", "#0284c7", "#70b8ff", "#e0f2fe"],
  },
  {
    name: "Aurora Mint",
    colors: ["#0f172a", "#065f46", "#10b981", "#3dd68c", "#a7f3d0"],
  },
];

export default function HeatmapLogoExperiment() {
  return (
    <CareerShell width="max-w-6xl">
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand/40 pb-4">
          <div>
            <p className="font-mono text-xs text-brand">SPECIMEN 02 // WEBGL SHADER</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Heatmap Logo</h1>
          </div>
          <CareerButton variant="secondary" size="sm" icon={ArrowLeft} href="/experiments">
            Back to Experiments
          </CareerButton>
        </div>

        <section className="grid gap-6 sm:grid-cols-2">
          {colorPresets.map((preset) => (
            <div
              key={preset.name}
              className="flex flex-col items-center justify-between gap-4 border border-brand/40 bg-black p-6"
            >
              <div className="w-full flex items-center justify-between border-b border-white/15 pb-2 font-mono text-xs">
                <span className="text-brand">{preset.name}</span>
                <span className="text-muted-foreground">{preset.colors.length} STOPS</span>
              </div>
              <HeatmapLogo size={200} colors={preset.colors} />
            </div>
          ))}
        </section>
      </div>
    </CareerShell>
  );
}
