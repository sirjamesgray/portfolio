import { TimeMachine } from "@/components/time-machine";
import { LiquidMetalLogo } from "@/components/liquid-metal-logo";
import { HeatmapLogo } from "@/components/heatmap-logo";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main>
        <div className="px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Experiments
          </h1>
          <p className="text-muted-foreground">
            Experimental UI components and features
          </p>
        </div>

        {/* Liquid Metal Logo Section */}
        <section className="px-6 py-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Liquid Metal Logo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {/* Emerald (Default) */}
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

            {/* Chrome Silver */}
            <div className="text-center">
              <LiquidMetalLogo
                size={200}
                colorBack="#1a1a2e"
                colorTint="#a8a8a8"
                speed={0.3}
                repetition={6}
                softness={0.7}
                distortion={0.2}
              />
              <p className="mt-3 text-sm text-muted-foreground">Chrome</p>
            </div>

            {/* Gold */}
            <div className="text-center">
              <LiquidMetalLogo
                size={200}
                colorBack="#1a1506"
                colorTint="#fbbf24"
                speed={0.4}
                repetition={5}
                shiftRed={0.2}
                shiftBlue={-0.2}
              />
              <p className="mt-3 text-sm text-muted-foreground">Gold</p>
            </div>

            {/* Purple Haze */}
            <div className="text-center">
              <LiquidMetalLogo
                size={200}
                colorBack="#0f0a1a"
                colorTint="#a855f7"
                speed={0.6}
                repetition={3}
                distortion={0.5}
                contour={0.7}
              />
              <p className="mt-3 text-sm text-muted-foreground">Purple Haze</p>
            </div>

            {/* Rose */}
            <div className="text-center">
              <LiquidMetalLogo
                size={200}
                colorBack="#1a0a0f"
                colorTint="#f43f5e"
                speed={0.5}
                repetition={4}
                softness={0.6}
              />
              <p className="mt-3 text-sm text-muted-foreground">Rose</p>
            </div>

            {/* Cyan Electric */}
            <div className="text-center">
              <LiquidMetalLogo
                size={200}
                colorBack="#000a14"
                colorTint="#06b6d4"
                speed={0.7}
                repetition={5}
                distortion={0.4}
                angle={135}
              />
              <p className="mt-3 text-sm text-muted-foreground">Cyan Electric</p>
            </div>
          </div>
        </section>

        {/* Heatmap Logo Section */}
        <section className="px-6 py-8 border-t border-border">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Heatmap Logo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {/* Emerald Heat (Default) */}
            <div className="text-center">
              <HeatmapLogo
                size={200}
                colors={["#10b981", "#059669", "#047857"]}
                colorBack="#000000"
                speed={0.5}
                innerGlow={0.5}
                outerGlow={0.3}
              />
              <p className="mt-3 text-sm text-muted-foreground">Emerald Heat</p>
            </div>

            {/* Infrared */}
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

            {/* Ocean */}
            <div className="text-center">
              <HeatmapLogo
                size={200}
                colors={["#0ea5e9", "#06b6d4", "#14b8a6", "#10b981"]}
                colorBack="#020617"
                speed={0.3}
                innerGlow={0.4}
                outerGlow={0.5}
                angle={90}
              />
              <p className="mt-3 text-sm text-muted-foreground">Ocean</p>
            </div>

            {/* Sunset */}
            <div className="text-center">
              <HeatmapLogo
                size={200}
                colors={["#f43f5e", "#ec4899", "#d946ef", "#a855f7"]}
                colorBack="#0f0515"
                speed={0.5}
                innerGlow={0.5}
                outerGlow={0.4}
                noise={0.15}
              />
              <p className="mt-3 text-sm text-muted-foreground">Sunset</p>
            </div>

            {/* Aurora */}
            <div className="text-center">
              <HeatmapLogo
                size={200}
                colors={["#22c55e", "#14b8a6", "#06b6d4", "#8b5cf6"]}
                colorBack="#030712"
                speed={0.6}
                innerGlow={0.6}
                outerGlow={0.5}
                contour={0.7}
                angle={135}
              />
              <p className="mt-3 text-sm text-muted-foreground">Aurora</p>
            </div>

            {/* Lava */}
            <div className="text-center">
              <HeatmapLogo
                size={200}
                colors={["#7f1d1d", "#b91c1c", "#dc2626", "#f97316", "#fbbf24"]}
                colorBack="#1c1917"
                speed={0.4}
                innerGlow={0.7}
                outerGlow={0.6}
                noise={0.2}
                contour={0.8}
              />
              <p className="mt-3 text-sm text-muted-foreground">Lava</p>
            </div>
          </div>
        </section>

        {/* Time Machine Component */}
        <TimeMachine />
      </main>
    </div>
  );
}
