import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion"
import { AnimatedParticles } from "../../components/AnimatedParticles"
import { CornerGlow } from "../../components/CornerGlow"
import { SpinningLogo } from "../../components/SpinningLogo"

interface DeleteFigmaVideoProps {
  orientation?: "horizontal" | "vertical"
}

const points = [
  { icon: "🤖", title: "Use AI Agents", description: "Let AI write your components" },
  { icon: "🧩", title: "Build Systems", description: "Components, not mockups" },
  { icon: "⚡", title: "Ship Faster", description: "Code is the design" },
  { icon: "🔥", title: "Stay Honest", description: "No more drift" },
]

export const DeleteFigmaVideo: React.FC<DeleteFigmaVideoProps> = ({ orientation = "horizontal" }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const isVertical = orientation === "vertical"

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

  // Subtitle
  const subtitleOpacity = interpolate(frame, [25, 45], [0, 1])
  const subtitleY = interpolate(frame, [25, 55], [30, 0])

  // Gradient rotation
  const gradientRotation = interpolate(frame, [0, 240], [0, 360])

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientRotation}deg, #0f172a 0%, #7c2d12 50%, #0f172a 100%)`,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Animated background */}
      <AnimatedParticles count={25} color="#ef4444" minDistance={isVertical ? 150 : 250} maxDistance={isVertical ? 300 : 500} opacity={0.3} />
      <CornerGlow color="#ef4444" opacity={0.4} />

      {/* Main Title Section */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: isVertical ? 60 : 100,
          }}
        >
          <div
            style={{
              opacity: titleOpacity,
              transform: `scale(${titleScale})`,
              textAlign: "center",
            }}
          >
            {/* Emoji */}
            <div style={{ fontSize: isVertical ? 80 : 120, marginBottom: isVertical ? 24 : 40 }}>
              🗑️
            </div>

            {/* Delete Figma */}
            <div
              style={{
                fontSize: isVertical ? 64 : 120,
                fontWeight: 900,
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: isVertical ? 24 : 32,
                lineHeight: 1.1,
              }}
            >
              Delete Figma
            </div>

            {/* Subtitle */}
            <div
              style={{
                opacity: subtitleOpacity,
                transform: `translateY(${subtitleY}px)`,
                fontSize: isVertical ? 32 : 56,
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.9)",
                maxWidth: isVertical ? 500 : 900,
                lineHeight: 1.3,
              }}
            >
              Stop drawing pictures of software
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Points Section */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isVertical ? 60 : 100,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isVertical ? "1fr" : "repeat(2, 1fr)",
              gap: isVertical ? 20 : 32,
              maxWidth: isVertical ? "100%" : 1000,
              width: "100%",
            }}
          >
            {points.map((point, index) => {
              const delay = 10 + index * 15
              const progress = spring({
                frame: frame - 90 - delay,
                fps,
                config: {
                  damping: 100,
                  stiffness: 200,
                },
              })

              const opacity = interpolate(frame - 90, [delay, delay + 20], [0, 1])
              const scale = interpolate(progress, [0, 1], [0.8, 1])
              const x = interpolate(progress, [0, 1], [-50, 0])

              return (
                <div
                  key={index}
                  style={{
                    opacity,
                    transform: `translateX(${x}px) scale(${scale})`,
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "2px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: 20,
                    padding: isVertical ? 28 : 36,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: isVertical ? 48 : 64, marginBottom: isVertical ? 12 : 16 }}>
                    {point.icon}
                  </div>
                  <div
                    style={{
                      fontSize: isVertical ? 28 : 36,
                      fontWeight: 800,
                      color: "#ef4444",
                      marginBottom: isVertical ? 8 : 12,
                    }}
                  >
                    {point.title}
                  </div>
                  <div
                    style={{
                      fontSize: isVertical ? 20 : 24,
                      fontWeight: 600,
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    {point.description}
                  </div>
                </div>
              )
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Final Message */}
      <Sequence from={240} durationInFrames={60}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: isVertical ? 60 : 100,
          }}
        >
          <div
            style={{
              fontSize: isVertical ? 48 : 80,
              fontWeight: 900,
              color: "white",
              textAlign: "center",
              opacity: interpolate(frame - 240, [0, 30], [0, 1]),
              lineHeight: 1.3,
            }}
          >
            Designers Should Code
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Bottom right logo */}
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? 40 : 60,
          right: isVertical ? 40 : 60,
        }}
      >
        <SpinningLogo size={isVertical ? 60 : 80} color="#ef4444" opacity={0.9} />
      </div>
    </AbsoluteFill>
  )
}
