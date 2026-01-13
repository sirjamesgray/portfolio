"use client";

import { useEffect, useState } from "react";
import { useSparkles } from "@/lib/sparkle-context";

interface TwinklingSparklesProps {
  /** Number of sparkles to render. Defaults to 12. */
  count?: number;
  /** Color of the sparkles. Defaults to white. */
  color?: string;
  /** Whether to ignore the global sparkle context and always show. Defaults to false. */
  forceShow?: boolean;
}

/**
 * TwinklingSparkles - Animated sparkle effect for cards
 *
 * By default, respects the global SparkleProvider context.
 * Use `forceShow` to bypass the context (e.g., for CTA cards that always sparkle).
 */
export function TwinklingSparkles({
  count = 12,
  color = "white",
  forceShow = false,
}: TwinklingSparklesProps) {
  const { sparklesEnabled } = useSparkles();
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      size: Math.random() * 2 + 1,
    }));
    setSparkles(newSparkles);
  }, [count]);

  // Don't render if sparkles are disabled globally (unless forceShow is true)
  if (!forceShow && !sparklesEnabled) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-10">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}
