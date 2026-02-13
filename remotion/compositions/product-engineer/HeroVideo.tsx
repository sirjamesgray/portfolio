import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion"
import { AnimatedParticles } from "../../components/AnimatedParticles"
import { CornerGlow } from "../../components/CornerGlow"
import { SpinningLogo } from "../../components/SpinningLogo"

interface HeroVideoProps {
  orientation?: "horizontal" | "vertical"
}

export const HeroVideo: React.FC<HeroVideoProps> = ({ orientation = "horizontal" }) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()

  const isVertical = orientation === "vertical"

  // Grid animation
  const gridOpacity = interpolate(frame, [0, 30], [0, 0.3])

  // Badge animation
  const badgeProgress = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })
  const badgeOpacity = interpolate(frame, [0, 15], [0, 1])
  const badgeY = interpolate(badgeProgress, [0, 1], [30, 0])

  // Name animation
  const nameProgress = spring({
    frame: frame - 15,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })
  const nameOpacity = interpolate(frame, [10, 30], [0, 1])
  const nameScale = interpolate(nameProgress, [0, 1], [0.9, 1])

  // Tagline animation
  const taglineOpacity = interpolate(frame, [30, 50], [0, 1])
  const taglineY = interpolate(frame, [30, 60], [20, 0])

  // Accent line
  const lineWidth = interpolate(frame, [50, 80], [0, 100])

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isVertical ? 60 : 100,
      }}
    >
      {/* Animated background */}
      <AnimatedParticles count={20} color="#10b981" minDistance={isVertical ? 150 : 250} maxDistance={isVertical ? 300 : 500} opacity={0.4} />
      <CornerGlow color="#10b981" opacity={0.5} />

      {/* Animated grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: gridOpacity,
          backgroundImage: "linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div style={{ textAlign: "center", maxWidth: isVertical ? 500 : 900 }}>
        {/* Badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            marginBottom: isVertical ? 20 : 32,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: 24,
              fontSize: isVertical ? 20 : 16,
              fontWeight: 600,
              color: "#10b981",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Product Engineer
          </div>
        </div>

        {/* Name */}
        <div
          style={{
            opacity: nameOpacity,
            transform: `scale(${nameScale})`,
            marginBottom: isVertical ? 20 : 32,
          }}
        >
          <div
            style={{
              fontSize: isVertical ? 96 : 120,
              fontWeight: 900,
              color: "white",
              marginBottom: 8,
            }}
          >
            Hi, I&apos;m{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Jamie Gray
            </span>
          </div>
        </div>

        {/* Accent line */}
        {frame >= 50 && (
          <div
            style={{
              width: `${lineWidth}%`,
              height: 3,
              background: "linear-gradient(90deg, transparent, #10b981, transparent)",
              margin: "0 auto",
              marginBottom: isVertical ? 20 : 32,
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)",
            }}
          />
        )}

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          <p
            style={{
              fontSize: isVertical ? 40 : 48,
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: 1.4,
              maxWidth: isVertical ? "100%" : 900,
              margin: "0 auto",
            }}
          >
            I design in code, not Figma
          </p>
        </div>

      </div>

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
