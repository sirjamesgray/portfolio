import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion"

interface ProductDemoProps {
  productName: string
}

export const ProductDemo: React.FC<ProductDemoProps> = ({ productName }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Product name animation
  const nameProgress = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })

  const nameOpacity = interpolate(frame, [0, 30], [0, 1])
  const nameScale = interpolate(nameProgress, [0, 1], [0.8, 1])

  // Browser window animation
  const browserProgress = spring({
    frame: frame - 40,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  })

  const browserOpacity = interpolate(frame, [30, 60], [0, 1])
  const browserY = interpolate(browserProgress, [0, 1], [100, 0])

  // Floating elements
  const float1 = Math.sin(frame / 30) * 20
  const float2 = Math.cos(frame / 40) * 15
  const float3 = Math.sin(frame / 50) * 25

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating background elements */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.1)",
          filter: "blur(40px)",
          transform: `translateY(${float1}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(168, 85, 247, 0.1)",
          filter: "blur(40px)",
          transform: `translateY(${float2}px)`,
        }}
      />

      {/* Product name */}
      <div
        style={{
          opacity: nameOpacity,
          transform: `scale(${nameScale})`,
          fontSize: 96,
          fontWeight: 900,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 80,
          textAlign: "center",
        }}
      >
        {productName}
      </div>

      {/* Browser window mockup */}
      <div
        style={{
          opacity: browserOpacity,
          transform: `translateY(${browserY}px)`,
          width: 1200,
          height: 600,
          background: "white",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            height: 40,
            background: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
        </div>

        {/* Content area */}
        <div
          style={{
            height: 560,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 48,
            fontWeight: 700,
            position: "relative",
          }}
        >
          <div style={{ transform: `translateY(${float3}px)`, textAlign: "center" }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>✨</div>
            <div>Your Product in Action</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}
