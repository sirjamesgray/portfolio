"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TimeMachine } from "@/components/time-machine";
import { Footer } from "@/components/footer";

export default function TimeMachinePage() {
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
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Time Machine</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Interactive timeline component for visualizing chronological data with smooth
            animations and intuitive navigation.
          </p>
        </div>

        {/* Demo */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Interactive Demo</h2>
          <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
            <TimeMachine />
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Features</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted/30 p-6">
              <h3 className="font-medium text-foreground mb-2">Smooth Animations</h3>
              <p className="text-sm text-muted-foreground">
                Fluid transitions between timeline entries with spring-based animations.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-6">
              <h3 className="font-medium text-foreground mb-2">Keyboard Navigation</h3>
              <p className="text-sm text-muted-foreground">
                Navigate through time using arrow keys for accessibility.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-6">
              <h3 className="font-medium text-foreground mb-2">Responsive Design</h3>
              <p className="text-sm text-muted-foreground">
                Adapts to different screen sizes with mobile-optimized interactions.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-6">
              <h3 className="font-medium text-foreground mb-2">Customizable Data</h3>
              <p className="text-sm text-muted-foreground">
                Pass in your own timeline data with titles, descriptions, and dates.
              </p>
            </div>
          </div>
        </section>

        {/* Usage */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Usage</h2>
          <div className="rounded-xl border border-border bg-zinc-950 p-6 overflow-x-auto">
            <pre className="text-sm text-zinc-300">
              <code>{`import { TimeMachine } from "@/components/time-machine";

<TimeMachine />`}</code>
            </pre>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
