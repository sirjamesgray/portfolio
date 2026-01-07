"use client"

import { Heatmap } from "@paper-design/shaders-react"
import { Suspense } from "react"

interface HeatmapLogoProps {
  size?: number
  colors?: string[]
  colorBack?: string
  speed?: number
  contour?: number
  angle?: number
  noise?: number
  innerGlow?: number
  outerGlow?: number
  className?: string
}

export function HeatmapLogo({
  size = 300,
  colors = ["#10b981", "#059669", "#047857"], // emerald gradient
  colorBack = "#000000",
  speed = 0.5,
  contour = 0.5,
  angle = 45,
  noise = 0.1,
  innerGlow = 0.5,
  outerGlow = 0.3,
  className,
}: HeatmapLogoProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <Suspense fallback={
        <div
          className="w-full h-full bg-black/50 flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <span className="text-white/50 text-sm">Loading...</span>
        </div>
      }>
        <Heatmap
          image="/logo.svg"
          colors={colors}
          colorBack={colorBack}
          speed={speed}
          contour={contour}
          angle={angle}
          noise={noise}
          innerGlow={innerGlow}
          outerGlow={outerGlow}
          scale={1}
          style={{ width: size, height: size }}
        />
      </Suspense>
    </div>
  )
}
