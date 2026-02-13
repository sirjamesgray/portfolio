"use client";

import Link from "next/link";
import { ArrowLeft, Droplets } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LiquidMetalLogo } from "@/components/liquid-metal-logo";
import { Footer } from "@/components/footer";

export default function LiquidMetalLogoPage() {
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
            <div className="h-10 w-10 rounded-lg bg-slate-500/10 flex items-center justify-center">
              <Droplets className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Liquid Metal Logo</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Liquid metal shader effect with chromatic aberration and animated ripples. Uses the{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">LiquidMetal</code> shader from{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">@paper-design/shaders-react</code>.
          </p>
        </div>

        {/* Variants */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Variants</h2>
          <div className="flex flex-wrap justify-center gap-8 py-12 rounded-xl border border-border bg-card/50">
            <div className="text-center">
              <LiquidMetalLogo
                size={180}
                colorBack="#000000"
                colorTint="#10b981"
                speed={0.5}
                repetition={4}
              />
              <p className="mt-4 text-sm text-muted-foreground">Emerald</p>
            </div>
            <div className="text-center">
              <LiquidMetalLogo
                size={180}
                colorBack="#0a0a0a"
                colorTint="#ffffff"
                speed={0.4}
                repetition={3}
              />
              <p className="mt-4 text-sm text-muted-foreground">Silver</p>
            </div>
            <div className="text-center">
              <LiquidMetalLogo
                size={180}
                colorBack="#0a0a0a"
                colorTint="#fbbf24"
                speed={0.3}
                repetition={5}
              />
              <p className="mt-4 text-sm text-muted-foreground">Gold</p>
            </div>
          </div>
        </section>

        {/* Documentation */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Props</h2>
          <div className="rounded-xl border border-border bg-muted/30 p-6">
            <div className="grid gap-4 text-sm">
              <div className="flex gap-4">
                <code className="text-slate-600 dark:text-slate-400 shrink-0 w-32">colorTint</code>
                <span className="text-muted-foreground">Tint color applied to the metallic surface (hex)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-slate-600 dark:text-slate-400 shrink-0 w-32">colorBack</code>
                <span className="text-muted-foreground">Background color (hex)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-slate-600 dark:text-slate-400 shrink-0 w-32">speed</code>
                <span className="text-muted-foreground">Animation speed (0-1, default: 0.5)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-slate-600 dark:text-slate-400 shrink-0 w-32">repetition</code>
                <span className="text-muted-foreground">Number of ripple layers (1-10, default: 4)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-slate-600 dark:text-slate-400 shrink-0 w-32">shiftRed</code>
                <span className="text-muted-foreground">Red channel chromatic offset (-1 to 1)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-slate-600 dark:text-slate-400 shrink-0 w-32">shiftBlue</code>
                <span className="text-muted-foreground">Blue channel chromatic offset (-1 to 1)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-slate-600 dark:text-slate-400 shrink-0 w-32">distortion</code>
                <span className="text-muted-foreground">Surface distortion amount (0-1)</span>
              </div>
              <div className="flex gap-4">
                <code className="text-slate-600 dark:text-slate-400 shrink-0 w-32">size</code>
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
              <code>{`import { LiquidMetalLogo } from "@/components/liquid-metal-logo";

<LiquidMetalLogo
  size={180}
  colorBack="#000000"
  colorTint="#10b981"
  speed={0.5}
  repetition={4}
/>`}</code>
            </pre>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
