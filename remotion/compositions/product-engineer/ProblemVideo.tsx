import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion"
import { AnimatedParticles } from "../../components/AnimatedParticles"
import { CornerGlow } from "../../components/CornerGlow"
import { SpinningLogo } from "../../components/SpinningLogo"

interface Problem {
  icon: string
  title: string
  description: string
}

interface ProblemVideoProps {
  orientation?: "horizontal" | "vertical"
}

const problems: Problem[] = [
  { icon: "🔄", title: "Rebuild Everything", description: "Engineers rebuild what designers already made" },
  { icon: "📄", title: "Lost Details", description: "Handoffs kill the good stuff" },
  { icon: "🔀", title: "System Drift", description: "Design and code never match" },
  { icon: "🛡️", title: "QA Finds Bugs", description: "QA catches UI issues too late" },
  { icon: "🔌", title: "Slow Iteration", description: "Design → Code = Slow" },
  { icon: "⏰", title: "Duplicate Work", description: "Same components, built twice" },
]

const ProblemCard: React.FC<{ problem: Problem; delay: number; isVertical: boolean }> = ({ problem, delay, isVertical }) => {
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

  const opacity = interpolate(frame, [delay, delay + 15], [0, 1])
  const scale = interpolate(progress, [0, 1], [0.8, 1])
  const x = interpolate(progress, [0, 1], [-50, 0])

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px) scale(${scale})`,
        background: "rgba(239, 68, 68, 0.05)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        borderRadius: 16,
        padding: isVertical ? 20 : 24,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontSize: isVertical ? 48 : 40,
          marginBottom: isVertical ? 8 : 12,
        }}
      >
        {problem.icon}
      </div>
      <div
        style={{
          fontSize: isVertical ? 36 : 32,
          fontWeight: 800,
          color: "#ef4444",
          marginBottom: isVertical ? 8 : 12,
        }}
      >
        {problem.title}
      </div>
      <div
        style={{
          fontSize: isVertical ? 24 : 22,
          fontWeight: 600,
          color: "rgba(255, 255, 255, 0.8)",
          lineHeight: 1.4,
        }}
      >
        {problem.description}
      </div>
    </div>
  )
}

export const ProblemVideo: React.FC<ProblemVideoProps> = ({ orientation = "horizontal" }) => {
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

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: isVertical ? "60px 40px" : "80px 100px",
        overflow: "hidden",
      }}
    >
      {/* Animated background */}
      <AnimatedParticles count={15} color="#ef4444" minDistance={isVertical ? 150 : 200} maxDistance={isVertical ? 300 : 400} opacity={0.3} />
      <CornerGlow color="#ef4444" opacity={0.4} />

      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: isVertical ? 32 : 48,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: isVertical ? 22 : 20,
            fontWeight: 600,
            color: "#ef4444",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "50%",
              width: isVertical ? 40 : 48,
              height: isVertical ? 40 : 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isVertical ? 28 : 24,
            }}
          >
            ⚠️
          </div>
          <span style={{ letterSpacing: 2, textTransform: "uppercase" }}>The Problem</span>
        </div>
        <div
          style={{
            fontSize: isVertical ? 56 : 64,
            fontWeight: 900,
            color: "white",
            marginBottom: 12,
          }}
        >
          The Problem
        </div>
      </div>

      {/* Problems Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isVertical ? "1fr" : "repeat(2, 1fr)",
          gap: isVertical ? 12 : 20,
          maxWidth: isVertical ? "100%" : 1200,
          margin: "0 auto",
        }}
      >
        {problems.map((problem, index) => (
          <ProblemCard
            key={index}
            problem={problem}
            delay={30 + index * 12}
            isVertical={isVertical}
          />
        ))}
      </div>

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
