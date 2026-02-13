interface CornerGlowProps {
  color?: string
  opacity?: number
}

export const CornerGlow: React.FC<CornerGlowProps> = ({
  color = "#10b981",
  opacity = 0.5,
}) => {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: -150,
          left: -150,
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          right: -150,
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          opacity,
        }}
      />
    </>
  )
}
