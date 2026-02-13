import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion"

interface LogoRevealProps {
  brandName: string
  subtitle?: string
  accentColor?: string
}

export const LogoReveal: React.FC<LogoRevealProps> = ({
  brandName,
  subtitle = "Web Development",
  accentColor = "#667eea",
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Circle expand animation
  const circleProgress = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 80,
      stiffness: 100,
    },
  })

  const circleScale = interpolate(circleProgress, [0, 1], [0, 30])
  const circleOpacity = interpolate(frame, [10, 30], [1, 0])

  // Logo elements animation
  const logoProgress = spring({
    frame: frame - 40,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })

  const letterSpacing = interpolate(logoProgress, [0, 1], [100, 0])
  const logoOpacity = interpolate(frame, [30, 50], [0, 1])
  const logoScale = interpolate(logoProgress, [0, 1], [1.5, 1])

  // Glow effect
  const glowIntensity = interpolate(frame, [50, 80], [0, 1])

  // Shine effect
  const shineX = interpolate(frame, [60, 100], [-100, 200])

  // Subtitle animation
  const subtitleProgress = spring({
    frame: frame - 80,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })

  const subtitleOpacity = interpolate(frame, [70, 90], [0, 1])
  const subtitleY = interpolate(subtitleProgress, [0, 1], [30, 0])

  // Particles
  const particleOpacity = interpolate(frame, [90, 110], [0, 1])

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Initial circle expand */}
      {frame >= 10 && frame <= 40 && (
        <div
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: accentColor,
            opacity: circleOpacity,
            transform: `scale(${circleScale})`,
            filter: "blur(20px)",
          }}
        />
      )}

      {/* Animated particles */}
      {frame >= 90 && (
        <AbsoluteFill>
          {[...Array(30)].map((_, i) => {
            const angle = (i / 30) * Math.PI * 2
            const distance = 400 + Math.sin(frame / 10 + i) * 50
            const x = Math.cos(angle) * distance
            const y = Math.sin(angle) * distance
            const size = 4 + (i % 3) * 2

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
                  opacity: particleOpacity * 0.6,
                  transform: `translate(${x}px, ${y}px)`,
                  boxShadow: `0 0 20px ${accentColor}`,
                }}
              />
            )
          })}
        </AbsoluteFill>
      )}

      {/* Logo container */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Main brand name */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "white",
              letterSpacing: `${letterSpacing}px`,
              textShadow: `0 0 ${glowIntensity * 40}px ${accentColor}, 0 0 ${glowIntensity * 80}px ${accentColor}`,
              position: "relative",
            }}
          >
            {brandName}
          </div>

          {/* Shine overlay */}
          {frame >= 60 && frame <= 100 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${shineX}%`,
                width: "30%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                transform: "skewX(-20deg)",
              }}
            />
          )}
        </div>

        {/* Accent line */}
        <div
          style={{
            width: interpolate(frame, [70, 100], [0, 400]),
            height: 4,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            marginTop: 24,
            marginBottom: 24,
            opacity: subtitleOpacity,
            boxShadow: `0 0 20px ${accentColor}`,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            fontSize: 36,
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.8)",
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Corner accents */}
      {frame >= 70 && (
        <>
          <div
            style={{
              position: "absolute",
              top: 60,
              left: 60,
              width: 100,
              height: 100,
              borderTop: `3px solid ${accentColor}`,
              borderLeft: `3px solid ${accentColor}`,
              opacity: interpolate(frame, [70, 90], [0, 0.5]),
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 60,
              right: 60,
              width: 100,
              height: 100,
              borderBottom: `3px solid ${accentColor}`,
              borderRight: `3px solid ${accentColor}`,
              opacity: interpolate(frame, [70, 90], [0, 0.5]),
            }}
          />
        </>
      )}
    </AbsoluteFill>
  )
}
