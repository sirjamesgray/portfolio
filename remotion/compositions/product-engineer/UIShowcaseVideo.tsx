import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion"
import { AnimatedParticles } from "../../components/AnimatedParticles"
import { CornerGlow } from "../../components/CornerGlow"
import { SpinningLogo } from "../../components/SpinningLogo"

interface UIShowcaseVideoProps {
  orientation?: "horizontal" | "vertical"
}

export const UIShowcaseVideo: React.FC<UIShowcaseVideoProps> = ({ orientation = "horizontal" }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const isVertical = orientation === "vertical"

  // Header animation
  const headerProgress = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })
  const headerOpacity = interpolate(frame, [0, 20], [0, 1])
  const headerY = interpolate(headerProgress, [0, 1], [50, 0])

  // Theme cards animation
  const theme1Progress = spring({
    frame: frame - 40,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })
  const theme1Opacity = interpolate(frame, [35, 50], [0, 1])
  const theme1X = interpolate(theme1Progress, [0, 1], [-100, 0])

  const theme2Progress = spring({
    frame: frame - 60,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })
  const theme2Opacity = interpolate(frame, [55, 70], [0, 1])
  const theme2X = interpolate(theme2Progress, [0, 1], [100, 0])

  // Code snippet
  const codeOpacity = interpolate(frame, [80, 100], [0, 1])

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: isVertical ? "60px 30px" : "80px 100px",
        overflow: "hidden",
      }}
    >
      {/* Animated background */}
      <AnimatedParticles count={18} color="#10b981" minDistance={isVertical ? 150 : 200} maxDistance={isVertical ? 300 : 400} opacity={0.35} />
      <CornerGlow color="#10b981" opacity={0.5} />

      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: isVertical ? 40 : 60,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: isVertical ? 22 : 20,
            fontWeight: 600,
            color: "#10b981",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "50%",
              width: isVertical ? 40 : 48,
              height: isVertical ? 40 : 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isVertical ? 28 : 24,
            }}
          >
            🎨
          </div>
          <span style={{ letterSpacing: 2, textTransform: "uppercase" }}>Flexibility</span>
        </div>
        <div
          style={{
            fontSize: isVertical ? 56 : 64,
            fontWeight: 900,
            color: "white",
            marginBottom: 16,
          }}
        >
          One Component
        </div>
        <div
          style={{
            fontSize: isVertical ? 36 : 40,
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.9)",
            maxWidth: isVertical ? "100%" : 800,
            margin: "0 auto",
            lineHeight: 1.4,
          }}
        >
          Any Theme
        </div>
      </div>

      {/* Theme Comparison */}
      <div
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          gap: isVertical ? 20 : 40,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: isVertical ? 40 : 60,
        }}
      >
        {/* Theme 1 - Paper */}
        <div
          style={{
            opacity: theme1Opacity,
            transform: `translateX(${theme1X}px)`,
            width: isVertical ? "100%" : 320,
            background: "white",
            borderRadius: 16,
            padding: 32,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ fontSize: 14, color: "#666", marginBottom: 16, fontWeight: 700, letterSpacing: 1 }}>PAPER</div>
          <div
            style={{
              background: "#0ea5e9",
              color: "white",
              padding: "14px 28px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Primary Button
          </div>
          <div
            style={{
              border: "2px solid #e5e7eb",
              padding: "12px 28px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textAlign: "center",
              color: "#374151",
            }}
          >
            Secondary Button
          </div>
        </div>

        {/* Arrow */}
        {frame >= 75 && (
          <div
            style={{
              fontSize: isVertical ? 32 : 48,
              color: "#10b981",
              opacity: interpolate(frame, [75, 85], [0, 1]),
            }}
          >
            {isVertical ? "↓" : "→"}
          </div>
        )}

        {/* Theme 2 - Dark */}
        <div
          style={{
            opacity: theme2Opacity,
            transform: `translateX(${theme2X}px)`,
            width: isVertical ? "100%" : 320,
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            borderRadius: 16,
            padding: 32,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ fontSize: 14, color: "#10b981", marginBottom: 16, fontWeight: 700, letterSpacing: 1 }}>DARK</div>
          <div
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              padding: "14px 28px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 16,
              boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
            }}
          >
            Primary Button
          </div>
          <div
            style={{
              border: "1px solid rgba(16, 185, 129, 0.3)",
              padding: "12px 28px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.9)",
              background: "rgba(16, 185, 129, 0.05)",
            }}
          >
            Secondary Button
          </div>
        </div>
      </div>

      {/* Code Example */}
      {frame >= 80 && (
        <div
          style={{
            opacity: codeOpacity,
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 12,
            padding: isVertical ? 20 : 32,
            maxWidth: isVertical ? "100%" : 600,
            margin: "0 auto",
          }}
        >
          <div style={{ fontSize: isVertical ? 16 : 14, fontFamily: "monospace", color: "rgba(255, 255, 255, 0.9)" }}>
            <div style={{ color: "#10b981", marginBottom: 8 }}>// Same component, different theme</div>
            <div><span style={{ color: "#818cf8" }}>&lt;Button</span> <span style={{ color: "#34d399" }}>variant</span>=<span style={{ color: "#fbbf24" }}>&quot;primary&quot;</span><span style={{ color: "#818cf8" }}>&gt;</span></div>
            <div style={{ paddingLeft: 20 }}>Click Me</div>
            <div><span style={{ color: "#818cf8" }}>&lt;/Button&gt;</span></div>
          </div>
        </div>
      )}

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
