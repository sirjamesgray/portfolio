import { useCurrentFrame, useVideoConfig } from "remotion"

interface SpinningLogoProps {
  size?: number
  color?: string
  opacity?: number
}

export const SpinningLogo: React.FC<SpinningLogoProps> = ({
  size = 80,
  color = "#10b981",
  opacity = 1,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Continuous rotation - 18 degrees per second (360 deg in 20 seconds)
  const rotation = (frame / fps) * 18

  // Grid configuration
  const gridLines = 4
  const gridStep = size / gridLines

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        opacity,
        transform: `rotateY(${rotation}deg) rotateX(15deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Wireframe cube border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `2px solid ${color}`,
          opacity: 0.9,
          boxShadow: `0 0 20px ${color}40`,
        }}
      />

      {/* Grid lines - vertical */}
      {[...Array(gridLines - 1)].map((_, i) => {
        const pos = gridStep * (i + 1)
        return (
          <div
            key={`v-${i}`}
            style={{
              position: "absolute",
              left: pos,
              top: 0,
              bottom: 0,
              width: 1,
              background: `${color}`,
              opacity: 0.25,
            }}
          />
        )
      })}

      {/* Grid lines - horizontal */}
      {[...Array(gridLines - 1)].map((_, i) => {
        const pos = gridStep * (i + 1)
        return (
          <div
            key={`h-${i}`}
            style={{
              position: "absolute",
              top: pos,
              left: 0,
              right: 0,
              height: 1,
              background: `${color}`,
              opacity: 0.25,
            }}
          />
        )
      })}

      {/* Center logo - wireframe style */}
      <svg
        viewBox="0 0 174 174"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          inset: size * 0.15,
          width: size * 0.7,
          height: size * 0.7,
        }}
      >
        {/* J letter - outline only */}
        <path
          d="M13.501 132.5V95.2568H21.501V132.5C21.501 146.031 32.47 157 46.001 157C59.5317 157 70.501 146.031 70.501 132.5V64.4727C70.5008 37.3964 45.5465 17 13.499 17V9H78.501V132.5C78.501 150.449 63.95 165 46.001 165C28.0517 165 13.501 150.449 13.501 132.5Z"
          fill={color}
          opacity={0.4}
        />
        <path
          d="M13.501 132.5V95.2568H21.501V132.5C21.501 146.031 32.47 157 46.001 157C59.5317 157 70.501 146.031 70.501 132.5V64.4727C70.5008 37.3964 45.5465 17 13.499 17V9H78.501V132.5C78.501 150.449 63.95 165 46.001 165C28.0517 165 13.501 150.449 13.501 132.5Z"
          stroke={color}
          strokeWidth="3"
          fill="none"
        />

        {/* G letter - outline only */}
        <path
          d="M107.501 132.5V41.5C107.501 27.969 118.47 17 132.001 17C145.532 17 156.501 27.969 156.501 41.5V59.4727H164.501V41.5C164.501 23.5507 149.95 9 132.001 9C114.052 9 99.501 23.5507 99.501 41.5V132.5C99.501 150.481 114.26 165 132.177 165C149.624 165 164.044 151.083 164.49 133.681L164.501 132.85V95.2568H118.791V103.257C130.272 103.257 139.759 106.164 146.276 111.21C152.684 116.17 156.501 123.393 156.501 132.85L156.493 133.472C156.158 146.492 145.338 157 132.177 157C118.614 157 107.501 145.999 107.501 132.5Z"
          fill={color}
          opacity={0.4}
        />
        <path
          d="M107.501 132.5V41.5C107.501 27.969 118.47 17 132.001 17C145.532 17 156.501 27.969 156.501 41.5V59.4727H164.501V41.5C164.501 23.5507 149.95 9 132.001 9C114.052 9 99.501 23.5507 99.501 41.5V132.5C99.501 150.481 114.26 165 132.177 165C149.624 165 164.044 151.083 164.49 133.681L164.501 132.85V95.2568H118.791V103.257C130.272 103.257 139.759 106.164 146.276 111.21C152.684 116.17 156.501 123.393 156.501 132.85L156.493 133.472C156.158 146.492 145.338 157 132.177 157C118.614 157 107.501 145.999 107.501 132.5Z"
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
      </svg>

      {/* 3D depth effect - simulated back face */}
      <div
        style={{
          position: "absolute",
          inset: 3,
          border: `1px solid ${color}`,
          opacity: 0.3,
          transform: "translateZ(-10px)",
        }}
      />
    </div>
  )
}
