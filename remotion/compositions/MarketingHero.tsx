import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion"

interface MarketingHeroProps {
  title: string
  subtitle: string
}

export const MarketingHero: React.FC<MarketingHeroProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Title animation
  const titleProgress = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  })

  const titleOpacity = interpolate(frame, [0, 30], [0, 1])
  const titleY = interpolate(titleProgress, [0, 1], [50, 0])

  // Subtitle animation
  const subtitleProgress = spring({
    frame: frame - 40,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  })

  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1])
  const subtitleY = interpolate(subtitleProgress, [0, 1], [30, 0])

  // Background gradient animation
  const gradientRotation = interpolate(frame, [0, 300], [0, 360])

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientRotation}deg, #667eea 0%, #764ba2 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 120,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          textShadow: "0 10px 30px rgba(0,0,0,0.3)",
          marginBottom: 40,
        }}
      >
        {title}
      </div>
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontSize: 48,
          fontWeight: 400,
          color: "rgba(255,255,255,0.9)",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  )
}
