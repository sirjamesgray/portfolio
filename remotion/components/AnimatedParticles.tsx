import { useCurrentFrame } from "remotion"

interface AnimatedParticlesProps {
  count?: number
  color?: string
  minDistance?: number
  maxDistance?: number
  opacity?: number
}

export const AnimatedParticles: React.FC<AnimatedParticlesProps> = ({
  count = 30,
  color = "#10b981",
  minDistance = 200,
  maxDistance = 400,
  opacity = 0.4,
}) => {
  const frame = useCurrentFrame()

  return (
    <>
      {[...Array(count)].map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const distance = minDistance + Math.sin(frame / 20 + i) * (maxDistance - minDistance) / 2
        const x = Math.cos(angle) * distance + Math.sin(frame / 20 + i) * 50
        const y = Math.sin(angle) * distance + Math.cos(frame / 30 + i) * 50
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
              background: color,
              opacity,
              transform: `translate(${x}px, ${y}px)`,
              boxShadow: `0 0 20px ${color}`,
            }}
          />
        )
      })}
    </>
  )
}
