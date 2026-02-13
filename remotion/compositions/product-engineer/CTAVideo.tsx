import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion"
import { AnimatedParticles } from "../../components/AnimatedParticles"
import { CornerGlow } from "../../components/CornerGlow"
import { SpinningLogo } from "../../components/SpinningLogo"

interface CTAVideoProps {
  orientation?: "horizontal" | "vertical"
}

export const CTAVideo: React.FC<CTAVideoProps> = ({ orientation = "horizontal" }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const isVertical = orientation === "vertical"

  // Background gradient rotation
  const gradientRotation = interpolate(frame, [0, 180], [0, 360])

  // Main title animation
  const titleProgress = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })
  const titleOpacity = interpolate(frame, [0, 25], [0, 1])
  const titleScale = interpolate(titleProgress, [0, 1], [0.8, 1])

  // Subtitle animation
  const subtitleOpacity = interpolate(frame, [25, 45], [0, 1])
  const subtitleY = interpolate(frame, [25, 55], [30, 0])

  // Button animation
  const buttonProgress = spring({
    frame: frame - 60,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })
  const buttonOpacity = interpolate(frame, [55, 75], [0, 1])
  const buttonScale = interpolate(buttonProgress, [0, 1], [0.5, 1])

  // Button pulse
  const buttonPulse = 1 + Math.sin(frame / 15) * 0.05

  // Particles
  const particleOpacity = interpolate(frame, [0, 30], [0, 1])

  // Tagline at bottom
  const taglineOpacity = interpolate(frame, [90, 110], [0, 1])

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientRotation}deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Animated background */}
      <AnimatedParticles count={25} color="#10b981" minDistance={isVertical ? 200 : 350} maxDistance={isVertical ? 350 : 600} opacity={0.4} />
      <CornerGlow color="#10b981" opacity={0.5} />

      {/* Main content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isVertical ? 60 : 100,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            textAlign: "center",
            marginBottom: isVertical ? 24 : 40,
          }}
        >
          <div
            style={{
              fontSize: isVertical ? 64 : 96,
              fontWeight: 900,
              background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.2,
            }}
          >
            Let&apos;s Work Together
          </div>
        </div>

        {/* Accent line */}
        {frame >= 30 && (
          <div
            style={{
              width: interpolate(frame, [30, 60], [0, isVertical ? 200 : 300]),
              height: 3,
              background: "linear-gradient(90deg, transparent, #10b981, transparent)",
              marginBottom: isVertical ? 24 : 40,
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)",
            }}
          />
        )}

        {/* Subtitle */}
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            textAlign: "center",
            marginBottom: isVertical ? 32 : 48,
          }}
        >
          <p
            style={{
              fontSize: isVertical ? 32 : 40,
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: 1.4,
              maxWidth: isVertical ? 450 : 800,
            }}
          >
            Looking for full-time Product Engineer roles
          </p>
        </div>

        {/* CTA Button */}
        {frame >= 55 && (
          <div
            style={{
              opacity: buttonOpacity,
              transform: `scale(${buttonScale * buttonPulse})`,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              padding: isVertical ? "20px 48px" : "24px 64px",
              borderRadius: 12,
              boxShadow: "0 20px 60px rgba(16, 185, 129, 0.4), 0 0 80px rgba(16, 185, 129, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              position: "relative",
              overflow: "hidden",
              marginBottom: isVertical ? 32 : 48,
            }}
          >
            {/* Shine effect */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: interpolate(frame, [60, 120], [-100, 200]),
                width: "50%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                transform: "skewX(-20deg)",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: isVertical ? 32 : 36,
                fontWeight: 800,
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: isVertical ? 24 : 32 }}>✉️</span>
              Let&apos;s Talk
            </div>
          </div>
        )}

        {/* Bottom tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: isVertical ? 24 : 28,
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Design in <span style={{ fontFamily: "monospace", color: "#10b981", fontWeight: 700 }}>Git</span>, not Figma
          </p>
        </div>
      </AbsoluteFill>

      {/* Bottom right logo */}
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? 40 : 60,
          right: isVertical ? 40 : 60,
        }}
      >
        <SpinningLogo size={isVertical ? 60 : 80} color="#10b981" opacity={0.9} />
      </div>
    </AbsoluteFill>
  )
}
