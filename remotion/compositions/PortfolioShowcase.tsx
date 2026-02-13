import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion"

interface Project {
  title: string
  description: string
  tech: string[]
}

interface PortfolioShowcaseProps {
  name: string
  tagline: string
  projects: Project[]
}

const ProjectCard: React.FC<{ project: Project; delay: number }> = ({ project, delay }) => {
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
  const y = interpolate(progress, [0, 1], [50, 0])

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 16,
        padding: 40,
        width: 500,
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h3
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: "white",
          marginBottom: 16,
        }}
      >
        {project.title}
      </h3>
      <p
        style={{
          fontSize: 20,
          color: "rgba(255, 255, 255, 0.8)",
          marginBottom: 24,
          lineHeight: 1.5,
        }}
      >
        {project.description}
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {project.tech.map((tech, index) => (
          <div
            key={index}
            style={{
              background: "rgba(103, 126, 234, 0.2)",
              border: "1px solid rgba(103, 126, 234, 0.3)",
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: 600,
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  )
}

export const PortfolioShowcase: React.FC<PortfolioShowcaseProps> = ({
  name,
  tagline,
  projects,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Background gradient rotation
  const gradientRotation = interpolate(frame, [0, 600], [0, 90])

  // Header animations
  const nameProgress = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })

  const nameOpacity = interpolate(frame, [0, 20], [0, 1])
  const nameY = interpolate(nameProgress, [0, 1], [100, 0])

  const taglineOpacity = interpolate(frame, [20, 40], [0, 1])
  const taglineY = interpolate(nameProgress, [0, 1], [50, 0])

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientRotation}deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Animated background particles */}
      <AbsoluteFill>
        {[...Array(20)].map((_, i) => {
          const x = (i % 5) * 20
          const y = Math.floor(i / 5) * 25
          const delay = i * 2
          const float = Math.sin((frame + delay) / 30) * 20

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(103, 126, 234, 0.3)",
                transform: `translateY(${float}px)`,
                boxShadow: "0 0 20px rgba(103, 126, 234, 0.5)",
              }}
            />
          )
        })}
      </AbsoluteFill>

      {/* Header Section */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 100,
          }}
        >
          <div
            style={{
              opacity: nameOpacity,
              transform: `translateY(${nameY}px)`,
              fontSize: 96,
              fontWeight: 900,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            {name}
          </div>
          <div
            style={{
              opacity: taglineOpacity,
              transform: `translateY(${taglineY}px)`,
              fontSize: 42,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.8)",
              textAlign: "center",
              maxWidth: 800,
            }}
          >
            {tagline}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Projects Section */}
      {projects.map((project, index) => (
        <Sequence key={index} from={90 + index * 120} durationInFrames={120}>
          <AbsoluteFill
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 100,
            }}
          >
            <ProjectCard project={project} delay={10} />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* Outro */}
      <Sequence from={90 + projects.length * 120} durationInFrames={90}>
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
              opacity: interpolate(frame - (90 + projects.length * 120), [0, 30], [0, 1]),
            }}
          >
            Let&apos;s Build Together
          </div>
          <div
            style={{
              fontSize: 36,
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: 24,
              opacity: interpolate(frame - (90 + projects.length * 120), [20, 50], [0, 1]),
            }}
          >
            Get in touch today
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
