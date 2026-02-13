"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Palette } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UIShowcase, type ShowcaseStyle } from "@/components/ui-showcase";
import { UIStyleSwitcher } from "@/components/ui-style-switcher";
import { Footer } from "@/components/footer";

export default function UIShowcasePage() {
  const [showcaseStyle, setShowcaseStyle] = useState<ShowcaseStyle>("neon");

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
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">UI Showcase</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Auto-triggering component carousel with animated interactions. Components animate
            automatically on a timed loop, demonstrating various UI patterns and micro-interactions.
          </p>
        </div>

        {/* Style Switcher */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Style Theme</h2>
          <UIStyleSwitcher activeStyle={showcaseStyle} onStyleChange={setShowcaseStyle} />
        </section>

        {/* Demo */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Interactive Demo</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <UIShowcase style={showcaseStyle} />
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Components Included</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Toggle Switch", desc: "Animated on/off toggle" },
              { name: "Slider", desc: "Range input with smooth drag" },
              { name: "Button", desc: "Click feedback animation" },
              { name: "Badges", desc: "Animated label indicators" },
              { name: "Like Button", desc: "Heart animation with count" },
              { name: "Checkboxes", desc: "Multi-select with spring" },
              { name: "Settings Gear", desc: "Rotating icon animation" },
              { name: "Sparkle", desc: "Particle burst effect" },
              { name: "Calendar", desc: "Date picker interaction" },
              { name: "Power Button", desc: "On/off state toggle" },
              { name: "Volume Control", desc: "Audio level animation" },
              { name: "WiFi Signal", desc: "Connection indicator" },
              { name: "Dark Mode", desc: "Theme switch animation" },
              { name: "Progress Bar", desc: "Loading state animation" },
              { name: "Sync Button", desc: "Refresh/sync animation" },
              { name: "User Status", desc: "Online/offline indicator" },
              { name: "Location Pin", desc: "GPS marker animation" },
              { name: "Security Lock", desc: "Lock/unlock toggle" },
              { name: "Clock", desc: "Real-time update" },
              { name: "Loader", desc: "Spinning indicator" },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-lg border border-border bg-muted/30 p-4"
              >
                <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Usage */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Usage</h2>
          <div className="rounded-xl border border-border bg-zinc-950 p-6 overflow-x-auto">
            <pre className="text-sm text-zinc-300">
              <code>{`import { UIShowcase, type ShowcaseStyle } from "@/components/ui-showcase";
import { UIStyleSwitcher } from "@/components/ui-style-switcher";

const [style, setStyle] = useState<ShowcaseStyle>("neon");

<UIStyleSwitcher activeStyle={style} onStyleChange={setStyle} />
<UIShowcase style={style} />`}</code>
            </pre>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
