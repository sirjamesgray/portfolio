"use client"

import { LiquidMetal } from "@paper-design/shaders-react"
import { Suspense } from "react"

interface LiquidMetalLogoProps {
  size?: number
  colorBack?: string
  colorTint?: string
  speed?: number
  repetition?: number
  softness?: number
  distortion?: number
  contour?: number
  shiftRed?: number
  shiftBlue?: number
  angle?: number
  className?: string
}

export function LiquidMetalLogo({
  size = 300,
  colorBack = "#000000",
  colorTint = "#10b981", // emerald-500
  speed = 0.5,
  repetition = 4,
  softness = 0.5,
  distortion = 0.3,
  contour = 0.5,
  shiftRed = 0.1,
  shiftBlue = -0.1,
  angle = 45,
  className,
}: LiquidMetalLogoProps) {
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
        <LiquidMetal
          image="/logo.svg"
          colorBack={colorBack}
          colorTint={colorTint}
          speed={speed}
          repetition={repetition}
          softness={softness}
          distortion={distortion}
          contour={contour}
          shiftRed={shiftRed}
          shiftBlue={shiftBlue}
          angle={angle}
          scale={1}
          style={{ width: size, height: size }}
        />
      </Suspense>
    </div>
  )
}
