import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion"

interface CallToActionProps {
  headline: string
  subheadline: string
  buttonText: string
  urgencyText?: string
  accentColor?: string
}

export const CallToAction: React.FC<CallToActionProps> = ({
  headline,
  subheadline,
  buttonText,
  urgencyText = "Limited spots available",
  accentColor = "#667eea",
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Background animation
  const gradientRotation = interpolate(frame, [0, 240], [0, 360])

  // Headline animation
  const headlineProgress = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })

  const headlineOpacity = interpolate(frame, [0, 20], [0, 1])
  const headlineScale = interpolate(headlineProgress, [0, 1], [0.8, 1])

  // Subheadline animation
  const subheadlineOpacity = interpolate(frame, [20, 40], [0, 1])
  const subheadlineY = interpolate(frame, [20, 50], [30, 0])

  // Button animation
  const buttonProgress = spring({
    frame: frame - 60,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })

  const buttonOpacity = interpolate(frame, [50, 70], [0, 1])
  const buttonScale = interpolate(buttonProgress, [0, 1], [0.5, 1])

  // Button pulse effect
  const buttonPulse = 1 + Math.sin(frame / 15) * 0.05

  // Urgency text animation
  const urgencyOpacity = interpolate(frame, [80, 100], [0, 1])
  const urgencyBlink = Math.sin(frame / 10) > 0 ? 1 : 0.6

  // Particle animations
  const particleOpacity = interpolate(frame, [0, 30], [0, 1])

  // Stats counter animation
  const statsProgress = spring({
    frame: frame - 100,
    fps,
    config: {
      damping: 100,
      stiffness: 100,
    },
  })

  const statsOpacity = interpolate(frame, [90, 110], [0, 1])
  const projectsCount = Math.floor(interpolate(statsProgress, [0, 1], [0, 150]))
  const satisfactionRate = Math.floor(interpolate(statsProgress, [0, 1], [0, 99]))

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientRotation}deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Animated background particles */}
      <AbsoluteFill>
        {[...Array(40)].map((_, i) => {
          const angle = (i / 40) * Math.PI * 2
          const distance = 300 + Math.sin(frame / 20 + i) * 100
          const x = Math.cos(angle) * distance
          const y = Math.sin(angle) * distance
          const size = 3 + (i % 4)

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: size,
                height: size,
                borderRadius: "50%",
                background: accentColor,
                opacity: particleOpacity * 0.4,
                transform: `translate(${x}px, ${y}px)`,
                boxShadow: `0 0 20px ${accentColor}`,
              }}
            />
          )
        })}
      </AbsoluteFill>

      {/* Main content container */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 100,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `scale(${headlineScale})`,
            fontSize: 96,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${accentColor} 0%, #764ba2 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textAlign: "center",
            marginBottom: 32,
            textShadow: `0 0 60px ${accentColor}40`,
            maxWidth: 1200,
          }}
        >
          {headline}
        </div>

        {/* Divider line */}
        <div
          style={{
            width: interpolate(frame, [30, 60], [0, 400]),
            height: 4,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            marginBottom: 32,
            boxShadow: `0 0 20px ${accentColor}`,
          }}
        />

        {/* Subheadline */}
        <div
          style={{
            opacity: subheadlineOpacity,
            transform: `translateY(${subheadlineY}px)`,
            fontSize: 42,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.9)",
            textAlign: "center",
            marginBottom: 60,
            maxWidth: 900,
            lineHeight: 1.5,
          }}
        >
          {subheadline}
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: buttonOpacity,
            transform: `scale(${buttonScale * buttonPulse})`,
            padding: "28px 80px",
            fontSize: 36,
            fontWeight: 700,
            color: "white",
            background: `linear-gradient(135deg, ${accentColor} 0%, #764ba2 100%)`,
            borderRadius: 16,
            cursor: "pointer",
            boxShadow: `0 20px 60px ${accentColor}60, 0 0 80px ${accentColor}40`,
            border: "2px solid rgba(255, 255, 255, 0.2)",
            position: "relative",
            overflow: "hidden",
            marginBottom: 40,
          }}
        >
          {/* Button shine effect */}
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
          <span style={{ position: "relative", zIndex: 1 }}>{buttonText}</span>
        </div>

        {/* Urgency text */}
        <div
          style={{
            opacity: urgencyOpacity * urgencyBlink,
            fontSize: 24,
            color: "#fbbf24",
            fontWeight: 600,
            marginBottom: 60,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#fbbf24",
              boxShadow: "0 0 20px #fbbf24",
            }}
          />
          {urgencyText}
        </div>

        {/* Stats */}
        {frame >= 90 && (
          <div
            style={{
              opacity: statsOpacity,
              display: "flex",
              gap: 80,
              marginTop: 40,
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: 32,
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                borderRadius: 16,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                minWidth: 200,
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${accentColor} 0%, #764ba2 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: 8,
                }}
              >
                {projectsCount}+
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 600,
                }}
              >
                Projects Delivered
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                padding: 32,
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                borderRadius: 16,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                minWidth: 200,
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${accentColor} 0%, #764ba2 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: 8,
                }}
              >
                {satisfactionRate}%
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 600,
                }}
              >
                Client Satisfaction
              </div>
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* Corner glow effects */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -200,
          right: -200,
          width: 600,
          height: 600,
          background: "radial-gradient(circle, #764ba220 0%, transparent 70%)",
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  )
}
