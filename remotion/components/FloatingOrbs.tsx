import { useCurrentFrame } from "remotion"

interface FloatingOrbsProps {
  color1?: string
  color2?: string
  color3?: string
}

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({
  color1 = "#667eea",
  color2 = "#764ba2",
  color3 = "#667eea",
}) => {
  const frame = useCurrentFrame()

  const float1 = Math.sin(frame / 30) * 30
  const float2 = Math.cos(frame / 40) * 40
  const float3 = Math.sin(frame / 50) * 25

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `${color1}20`,
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
          background: `${color2}20`,
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
          background: `${color3}15`,
          filter: "blur(60px)",
          transform: `translateY(${float3}px)`,
        }}
      />
    </>
  )
}
