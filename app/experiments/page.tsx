import Link from "next/link";
import { ArrowLeft, ArrowRight, Beaker, Cpu, Flame, Droplets, Clock, Palette } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/footer";

const experiments = [
  {
    id: "factory-os",
    title: "HomeLab",
    description: "Automated arbitrage pipeline: research overpriced products, 3D print cheaper alternatives, flood the market.",
    icon: Cpu,
    color: "emerald",
  },
  {
    id: "heatmap-logo",
    title: "Heatmap Logo",
    description: "Heat-map style logo with glowing colors and animated contours using WebGL shaders.",
    icon: Flame,
    color: "orange",
  },
  {
    id: "liquid-metal-logo",
    title: "Liquid Metal Logo",
    description: "Liquid metal shader effect with chromatic aberration and animated ripples.",
    icon: Droplets,
    color: "slate",
  },
  {
    id: "time-machine",
    title: "Time Machine",
    description: "Interactive timeline component for visualizing chronological data with smooth animations.",
    icon: Clock,
    color: "blue",
  },
  {
    id: "ui-showcase",
    title: "UI Showcase",
    description: "Auto-triggering component carousel with animated interactions on a timed loop.",
    icon: Palette,
    color: "purple",
  },
];

const colorClasses = {
  emerald: {
    bg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    border: "border-emerald-500/20 group-hover:border-emerald-500/40",
    icon: "text-emerald-600 dark:text-emerald-400",
    arrow: "text-emerald-600 dark:text-emerald-400",
  },
  orange: {
    bg: "bg-orange-500/10 group-hover:bg-orange-500/20",
    border: "border-orange-500/20 group-hover:border-orange-500/40",
    icon: "text-orange-600 dark:text-orange-400",
    arrow: "text-orange-600 dark:text-orange-400",
  },
  slate: {
    bg: "bg-slate-500/10 group-hover:bg-slate-500/20",
    border: "border-slate-500/20 group-hover:border-slate-500/40",
    icon: "text-slate-600 dark:text-slate-400",
    arrow: "text-slate-600 dark:text-slate-400",
  },
  blue: {
    bg: "bg-blue-500/10 group-hover:bg-blue-500/20",
    border: "border-blue-500/20 group-hover:border-blue-500/40",
    icon: "text-blue-600 dark:text-blue-400",
    arrow: "text-blue-600 dark:text-blue-400",
  },
  purple: {
    bg: "bg-purple-500/10 group-hover:bg-purple-500/20",
    border: "border-purple-500/20 group-hover:border-purple-500/40",
    icon: "text-purple-600 dark:text-purple-400",
    arrow: "text-purple-600 dark:text-purple-400",
  },
};

export default function ExperimentsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Beaker className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Experiments</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            A playground for testing new ideas, interactions, and visual effects.
            Click on any experiment to explore it in detail.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((experiment) => {
            const Icon = experiment.icon;
            const colors = colorClasses[experiment.color as keyof typeof colorClasses];

            return (
              <Link
                key={experiment.id}
                href={`/experiments/${experiment.id}`}
                className="group block"
              >
                <div className={`h-full rounded-xl border ${colors.border} ${colors.bg} p-6 transition-all duration-200 hover:shadow-lg`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-12 w-12 rounded-lg bg-background/50 flex items-center justify-center ${colors.icon}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className={`h-5 w-5 ${colors.arrow} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    {experiment.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {experiment.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
