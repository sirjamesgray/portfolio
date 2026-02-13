"use client";

import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeatmapLogo } from "@/components/heatmap-logo";
import { Footer } from "@/components/footer";

export default function HeatmapLogoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/experiments"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to experiments
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Heatmap Logo</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Heat-map style logo with glowing colors and animated contours. Uses the{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">Heatmap</code> shader from{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">@paper-design/shaders-react</code>.
          </p>
        </div>

        {/* Variants */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Variants</h2>
          <div className="flex flex-wrap justify-center gap-8 py-12 rounded-xl border border-border bg-card/50">
            <div className="text-center">
              <HeatmapLogo
                size={180}
                colors={["#10b981", "#059669", "#047857", "#065f46"]}
                colorBack="#0a0a0a"
                speed={0.4}
                innerGlow={0.5}
                outerGlow={0.3}
                contour={0.5}
              />
              <p className="mt-4 text-sm text-muted-foreground">Emerald</p>
            </div>
            <div className="text-center">
              <HeatmapLogo
                size={180}
                colors={["#dc2626", "#f97316", "#fbbf24", "#fef08a"]}
                colorBack="#0a0a0a"
                speed={0.4}
                innerGlow={0.6}
                outerGlow={0.4}
                contour={0.6}
              />
              <p className="mt-4 text-sm text-muted-foreground">Infrared</p>
            </div>
            <div className="text-center">
              <HeatmapLogo
                size={180}
                colors={["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7"]}
                colorBack="#0a0a0a"
                speed={0.3}
                innerGlow={0.4}
                outerGlow={0.5}
                contour={0.4}
              />
              <p className="mt-4 text-sm text-muted-foreground">Ultraviolet</p>
            </div>
          </div>
        </section>

        {/* Documentation */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Props</h2>
          <div className="rounded-xl border border-border bg-muted/30 p-6">
            <div className="grid gap-4 text-sm">
              <div className="flex gap-4">
                <code className="text-orange-600 dark:text-orange-400 shrink-0 w-32">colors</code>
                <span className="text-muted-foreground">
                  Array of hex colors for the gradient (e.g., <code className="bg-muted px-1 rounded text-xs">[&quot;#10b981&quot;, &quot;#059669&quot;]</code>)
                </span>
              </div>
              <div className="flex gap-4">
                <code className="text-orange-600 dark:text-orange-400 shrink-0 w-32">colorBack</code>
                <span className="text-muted-foreground">Background color (hex)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-orange-600 dark:text-orange-400 shrink-0 w-32">speed</code>
                <span className="text-muted-foreground">Animation speed (0-1, default: 0.5)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-orange-600 dark:text-orange-400 shrink-0 w-32">contour</code>
                <span className="text-muted-foreground">Edge definition strength (0-1)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-orange-600 dark:text-orange-400 shrink-0 w-32">innerGlow</code>
                <span className="text-muted-foreground">Inner glow intensity (0-1)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-orange-600 dark:text-orange-400 shrink-0 w-32">outerGlow</code>
                <span className="text-muted-foreground">Outer glow intensity (0-1)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-orange-600 dark:text-orange-400 shrink-0 w-32">size</code>
                <span className="text-muted-foreground">Size in pixels (default: 200)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Usage */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Usage</h2>
          <div className="rounded-xl border border-border bg-zinc-950 p-6 overflow-x-auto">
            <pre className="text-sm text-zinc-300">
              <code>{`import { HeatmapLogo } from "@/components/heatmap-logo";

<HeatmapLogo
  size={180}
  colors={["#10b981", "#059669", "#047857", "#065f46"]}
  colorBack="#0a0a0a"
  speed={0.4}
  innerGlow={0.5}
  outerGlow={0.3}
  contour={0.5}
/>`}</code>
            </pre>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
