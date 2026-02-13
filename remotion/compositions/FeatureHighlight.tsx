import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion"

interface Feature {
  icon: string
  title: string
  description: string
  benefits: string[]
}

interface FeatureHighlightProps {
  title: string
  features: Feature[]
  accentColor?: string
}

const FeatureCard: React.FC<{ feature: Feature; delay: number; accentColor: string }> = ({
  feature,
  delay,
  accentColor,
}) => {
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
  const scale = interpolate(progress, [0, 1], [0.8, 1])

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 800,
        padding: 60,
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(30px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 24,
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: 96,
          marginBottom: 32,
          background: `linear-gradient(135deg, ${accentColor} 0%, #764ba2 100%)`,
          width: 160,
          height: 160,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 20px 60px ${accentColor}40`,
        }}
      >
        {feature.icon}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 900,
          color: "white",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        {feature.title}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 28,
          color: "rgba(255, 255, 255, 0.8)",
          marginBottom: 40,
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        {feature.description}
      </div>

      {/* Benefits */}
      <div style={{ width: "100%" }}>
        {feature.benefits.map((benefit, index) => {
          const benefitOpacity = interpolate(frame, [delay + 30 + index * 10, delay + 40 + index * 10], [0, 1])
          const benefitX = interpolate(frame, [delay + 30 + index * 10, delay + 50 + index * 10], [-50, 0])

          return (
            <div
              key={index}
              style={{
                opacity: benefitOpacity,
                transform: `translateX(${benefitX}px)`,
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 16,
                padding: 16,
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: 12,
                border: `1px solid ${accentColor}40`,
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  color: accentColor,
                }}
              >
                ✓
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                {benefit}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  title,
  features,
  accentColor = "#667eea",
}) => {
  const frame = useCurrentFrame()

  // Background gradient animation
  const gradientRotation = interpolate(frame, [0, 900], [0, 180])

  // Header animation
  const headerOpacity = interpolate(frame, [0, 20], [0, 1])
  const headerScale = spring({
    frame: frame - 5,
    fps: 30,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })

  // Floating animation for background elements
  const float1 = Math.sin(frame / 30) * 30
  const float2 = Math.cos(frame / 40) * 40
  const float3 = Math.sin(frame / 50) * 25

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientRotation}deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Animated background blobs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `${accentColor}20`,
          filter: "blur(80px)",
          transform: `translateY(${float1}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "#764ba220",
          filter: "blur(80px)",
          transform: `translateY(${float2}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `${accentColor}15`,
          filter: "blur(60px)",
          transform: `translateY(${float3}px)`,
        }}
      />

      {/* Header */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              opacity: headerOpacity,
              transform: `scale(${headerScale})`,
              fontSize: 96,
              fontWeight: 900,
              background: `linear-gradient(135deg, ${accentColor} 0%, #764ba2 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textAlign: "center",
              padding: "0 100px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 32,
              width: interpolate(frame, [30, 60], [0, 300]),
              height: 4,
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              boxShadow: `0 0 20px ${accentColor}`,
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Features */}
      {features.map((feature, index) => (
        <Sequence key={index} from={90 + index * 180} durationInFrames={180}>
          <AbsoluteFill
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 100,
            }}
          >
            <FeatureCard feature={feature} delay={10} accentColor={accentColor} />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* Outro */}
      <Sequence from={90 + features.length * 180} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "white",
              textAlign: "center",
              opacity: interpolate(frame - (90 + features.length * 180), [0, 30], [0, 1]),
            }}
          >
            Ready to Experience These Features?
          </div>
          <div
            style={{
              fontSize: 36,
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: 24,
              opacity: interpolate(frame - (90 + features.length * 180), [20, 50], [0, 1]),
            }}
          >
            Let&apos;s get started
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
