"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { TimeMachine } from "@/components/time-machine";
import { LiquidMetalLogo } from "@/components/liquid-metal-logo";
import { HeatmapLogo } from "@/components/heatmap-logo";
import { UIShowcase } from "@/components/ui-showcase";
import { Footer } from "@/components/footer";

const sections = [
  { id: "heatmap-logo", label: "Heatmap Logo" },
  { id: "liquid-metal-logo", label: "Liquid Metal Logo" },
  { id: "time-machine", label: "Time Machine" },
  { id: "ui-showcase", label: "UI Showcase" },
];

export default function ExperimentsPage() {
  const [activeSection, setActiveSection] = useState("heatmap-logo");

  // Track active section based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-56 border-r border-border bg-background/95 backdrop-blur-sm z-40">
        <nav className="h-full overflow-y-auto py-8 px-4">
          {/* Back link and theme toggle */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <ThemeToggle />
          </div>

          <ul className="space-y-1">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <button
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
                    activeSection === id
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sticky Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        {/* Back link and theme toggle */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-sm font-medium text-foreground">Experiments</span>
          <ThemeToggle />
        </div>
        {/* Horizontal scrollable sections */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 px-4 pb-3">
            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={cn(
                  "shrink-0 px-3 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap",
                  activeSection === id
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - offset by sidebar width on lg screens */}
      <main className="lg:ml-56 pt-24 lg:pt-0">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Experiments</h1>
            <p className="text-muted-foreground max-w-2xl">
              Experimental UI components and features. A playground for testing new ideas and interactions.
            </p>
          </div>

          {/* Heatmap Logo */}
          <section id="heatmap-logo" className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-2">Heatmap Logo</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Heat-map style logo with glowing colors and animated contours. Uses the <code className="bg-muted px-1.5 py-0.5 rounded text-xs">Heatmap</code> shader from <code className="bg-muted px-1.5 py-0.5 rounded text-xs">@paper-design/shaders-react</code>.
            </p>

            {/* Variants */}
            <div className="flex flex-wrap justify-center gap-8 py-8 rounded-xl border border-border bg-card/50">
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
                <p className="mt-3 text-sm text-muted-foreground">Emerald</p>
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
                <p className="mt-3 text-sm text-muted-foreground">Infrared</p>
              </div>
            </div>

            {/* Documentation */}
            <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Props</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex gap-2">
                  <code className="text-emerald-600 dark:text-emerald-400 shrink-0">colors</code>
                  <span className="text-muted-foreground">Array of hex colors for the gradient (e.g., <code className="bg-muted px-1 rounded text-xs">[&quot;#10b981&quot;, &quot;#059669&quot;]</code>)</span>
                </div>
                <div className="flex gap-2">
                  <code className="text-emerald-600 dark:text-emerald-400 shrink-0">colorBack</code>
                  <span className="text-muted-foreground">Background color (hex)</span>
                </div>
                <div className="flex gap-2">
                  <code className="text-emerald-600 dark:text-emerald-400 shrink-0">speed</code>
                  <span className="text-muted-foreground">Animation speed (0-1, default: 0.5)</span>
                </div>
                <div className="flex gap-2">
                  <code className="text-emerald-600 dark:text-emerald-400 shrink-0">contour</code>
                  <span className="text-muted-foreground">Edge definition strength (0-1)</span>
                </div>
                <div className="flex gap-2">
                  <code className="text-emerald-600 dark:text-emerald-400 shrink-0">innerGlow / outerGlow</code>
                  <span className="text-muted-foreground">Glow intensity (0-1)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Liquid Metal Logo */}
          <section id="liquid-metal-logo" className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-2">Liquid Metal Logo</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Liquid metal shader effect with chromatic aberration and animated ripples. Uses the <code className="bg-muted px-1.5 py-0.5 rounded text-xs">LiquidMetal</code> shader from <code className="bg-muted px-1.5 py-0.5 rounded text-xs">@paper-design/shaders-react</code>.
            </p>

            {/* Variants */}
            <div className="flex flex-wrap justify-center gap-8 py-8 rounded-xl border border-border bg-card/50">
              <div className="text-center">
                <LiquidMetalLogo
                  size={180}
                  colorBack="#000000"
                  colorTint="#10b981"
                  speed={0.5}
                  repetition={4}
                />
                <p className="mt-3 text-sm text-muted-foreground">Emerald</p>
              </div>
              <div className="text-center">
                <LiquidMetalLogo
                  size={180}
                  colorBack="#0a0a0a"
                  colorTint="#ffffff"
                  speed={0.4}
                  repetition={3}
                />
                <p className="mt-3 text-sm text-muted-foreground">Silver</p>
              </div>
            </div>

            {/* Documentation */}
            <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Props</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex gap-2">
                  <code className="text-emerald-600 dark:text-emerald-400 shrink-0">colorTint</code>
                  <span className="text-muted-foreground">Tint color applied to the metallic surface (hex)</span>
                </div>
                <div className="flex gap-2">
                  <code className="text-emerald-600 dark:text-emerald-400 shrink-0">colorBack</code>
                  <span className="text-muted-foreground">Background color (hex)</span>
                </div>
                <div className="flex gap-2">
                  <code className="text-emerald-600 dark:text-emerald-400 shrink-0">speed</code>
                  <span className="text-muted-foreground">Animation speed (0-1, default: 0.5)</span>
                </div>
                <div className="flex gap-2">
                  <code className="text-emerald-600 dark:text-emerald-400 shrink-0">repetition</code>
                  <span className="text-muted-foreground">Number of ripple layers (1-10, default: 4)</span>
                </div>
                <div className="flex gap-2">
                  <code className="text-emerald-600 dark:text-emerald-400 shrink-0">shiftRed / shiftBlue</code>
                  <span className="text-muted-foreground">Chromatic aberration offset (-1 to 1)</span>
                </div>
                <div className="flex gap-2">
                  <code className="text-emerald-600 dark:text-emerald-400 shrink-0">distortion</code>
                  <span className="text-muted-foreground">Surface distortion amount (0-1)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Time Machine */}
          <section id="time-machine" className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-2">Time Machine</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Interactive timeline component for visualizing chronological data.
            </p>
            <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
              <TimeMachine />
            </div>
          </section>

          {/* UI Showcase */}
          <section id="ui-showcase" className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-2">UI Showcase</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Auto-triggering component carousel with animated interactions. Components animate automatically on a timed loop.
            </p>
            <div className="rounded-xl border border-border bg-card/50 overflow-hidden py-8">
              <UIShowcase />
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
