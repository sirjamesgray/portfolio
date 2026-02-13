import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion"

interface FeatureShowcaseProps {
  features: string[]
}

const Feature: React.FC<{ feature: string; delay: number }> = ({ feature, delay }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })

  const opacity = interpolate(frame, [delay, delay + 20], [0, 1])
  const scale = interpolate(progress, [0, 1], [0.5, 1])
  const x = interpolate(progress, [0, 1], [-100, 0])

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px) scale(${scale})`,
        fontSize: 64,
        fontWeight: 700,
        color: "white",
        padding: "40px 60px",
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: 20,
        margin: "20px 0",
        border: "2px solid rgba(255,255,255,0.2)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      }}
    >
      {feature}
    </div>
  )
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ features }) => {
  const frame = useCurrentFrame()

  const titleOpacity = interpolate(frame, [0, 20], [0, 1])
  const titleY = interpolate(frame, [0, 20], [50, 0])

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: 100,
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 96,
          fontWeight: 900,
          color: "white",
          marginBottom: 80,
          textShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        Features
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {features.map((feature, index) => (
          <Feature key={index} feature={feature} delay={30 + index * 30} />
        ))}
      </div>
    </AbsoluteFill>
  )
}
