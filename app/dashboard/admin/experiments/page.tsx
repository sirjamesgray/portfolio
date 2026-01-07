import { TimeMachine } from "@/components/time-machine";
import { LiquidMetalLogo } from "@/components/liquid-metal-logo";
import { HeatmapLogo } from "@/components/heatmap-logo";
import { UIShowcase } from "@/components/ui-showcase";
import { MobileBackButton } from "@/components/dashboard/mobile-back-button";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main>
        <MobileBackButton />
        <div className="px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Experiments
          </h1>
          <p className="text-muted-foreground">
            Experimental UI components and features
          </p>
        </div>

        {/* UI Showcase Carousel (moved from landing page) */}
        <section className="border-b border-border pb-8">
          <div className="px-6 mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Interactive UI Showcase
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Auto-triggering component carousel (previously on landing page)
            </p>
          </div>
          <UIShowcase />
        </section>

        {/* Liquid Metal Logo Section */}
        <section className="px-6 py-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Liquid Metal Logo
          </h2>
          <div className="flex justify-center">
            <div className="text-center">
              <LiquidMetalLogo
                size={200}
                colorBack="#000000"
                colorTint="#10b981"
                speed={0.5}
                repetition={4}
              />
              <p className="mt-3 text-sm text-muted-foreground">Emerald</p>
            </div>
          </div>
        </section>

        {/* Heatmap Logo Section */}
        <section className="px-6 py-8 border-t border-border">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Heatmap Logo
          </h2>
          <div className="flex justify-center">
            <div className="text-center">
              <HeatmapLogo
                size={200}
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
        </section>

        {/* Time Machine Component */}
        <TimeMachine />
      </main>
    </div>
  );
}
