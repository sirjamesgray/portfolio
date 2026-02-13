import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion"

interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  rating: number
}

interface TestimonialVideoProps {
  testimonials: Testimonial[]
  accentColor?: string
}

const Star: React.FC<{ filled: boolean; delay: number }> = ({ filled, delay }) => {
  const frame = useCurrentFrame()
  const scale = spring({
    frame: frame - delay,
    fps: 30,
    config: {
      damping: 200,
      stiffness: 300,
    },
  })

  return (
    <div
      style={{
        fontSize: 32,
        color: filled ? "#fbbf24" : "rgba(255, 255, 255, 0.2)",
        transform: `scale(${scale})`,
      }}
    >
      ★
    </div>
  )
}

const TestimonialCard: React.FC<{ testimonial: Testimonial; delay: number; accentColor: string }> = ({
  testimonial,
  delay,
  accentColor,
}) => {
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

  const opacity = interpolate(frame, [delay, delay + 20], [0, 1])
  const scale = interpolate(progress, [0, 1], [0.9, 1])
  const y = interpolate(progress, [0, 1], [50, 0])

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        maxWidth: 1000,
        padding: 60,
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(30px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 24,
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.4)",
        position: "relative",
      }}
    >
      {/* Quote icon */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          fontSize: 120,
          color: accentColor,
          opacity: 0.2,
          fontFamily: "Georgia, serif",
          lineHeight: 1,
        }}
      >
        "
      </div>

      {/* Rating stars */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 32,
          position: "relative",
          zIndex: 1,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <Star key={i} filled={i < testimonial.rating} delay={delay + 20 + i * 3} />
        ))}
      </div>

      {/* Quote */}
      <div
        style={{
          fontSize: 32,
          color: "white",
          lineHeight: 1.6,
          marginBottom: 40,
          position: "relative",
          zIndex: 1,
          fontStyle: "italic",
        }}
      >
        {testimonial.quote}
      </div>

      {/* Author info */}
      <div
        style={{
          borderTop: `2px solid ${accentColor}`,
          paddingTop: 24,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "white",
            marginBottom: 8,
          }}
        >
          {testimonial.author}
        </div>
        <div
          style={{
            fontSize: 20,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          {testimonial.role} at {testimonial.company}
        </div>
      </div>
    </div>
  )
}

export const TestimonialVideo: React.FC<TestimonialVideoProps> = ({
  testimonials,
  accentColor = "#667eea",
}) => {
  const frame = useCurrentFrame()

  // Background gradient animation
  const gradientRotation = interpolate(frame, [0, 600], [0, 90])

  // Header animation
  const headerOpacity = interpolate(frame, [0, 20], [0, 1])
  const headerY = interpolate(frame, [0, 30], [50, 0])

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientRotation}deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Animated background particles */}
      <AbsoluteFill>
        {[...Array(15)].map((_, i) => {
          const x = (i % 5) * 25
          const y = Math.floor(i / 5) * 33
          const delay = i * 3
          const float = Math.sin((frame + delay) / 40) * 30

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: accentColor,
                opacity: 0.2,
                transform: `translateY(${float}px)`,
                boxShadow: `0 0 30px ${accentColor}`,
              }}
            />
          )
        })}
      </AbsoluteFill>

      {/* Header */}
      <Sequence from={0} durationInFrames={90}>
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
              opacity: headerOpacity,
              transform: `translateY(${headerY}px)`,
              fontSize: 96,
              fontWeight: 900,
              background: `linear-gradient(135deg, ${accentColor} 0%, #764ba2 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Client Success Stories
          </div>
          <div
            style={{
              opacity: interpolate(frame, [20, 40], [0, 1]),
              fontSize: 36,
              color: "rgba(255, 255, 255, 0.7)",
              textAlign: "center",
            }}
          >
            What our clients say about us
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Testimonials */}
      {testimonials.map((testimonial, index) => (
        <Sequence key={index} from={90 + index * 150} durationInFrames={150}>
          <AbsoluteFill
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 100,
            }}
          >
            <TestimonialCard testimonial={testimonial} delay={10} accentColor={accentColor} />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* Outro */}
      <Sequence from={90 + testimonials.length * 150} durationInFrames={90}>
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
              opacity: interpolate(frame - (90 + testimonials.length * 150), [0, 30], [0, 1]),
            }}
          >
            Join Our Happy Clients
          </div>
          <div
            style={{
              fontSize: 36,
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: 24,
              opacity: interpolate(frame - (90 + testimonials.length * 150), [20, 50], [0, 1]),
            }}
          >
            Start your project today
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
