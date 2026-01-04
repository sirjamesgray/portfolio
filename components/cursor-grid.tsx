"use client";

import { useEffect, useState, useId, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CursorGridProps {
  className?: string;
  gridSize?: number;
}

interface TwinkleState {
  [key: number]: number;
}

export function CursorGrid({ className, gridSize = 40 }: CursorGridProps) {
  const id = useId();
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [twinkleStates, setTwinkleStates] = useState<TwinkleState>({});

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  // Generate grid intersection points
  const intersections = useMemo(() => {
    const points: { x: number; y: number; index: number }[] = [];
    const cols = Math.ceil(dimensions.width / gridSize) + 1;
    const rows = Math.ceil(dimensions.height / gridSize) + 1;

    let index = 0;
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        points.push({
          x: col * gridSize,
          y: row * gridSize,
          index,
        });
        index++;
      }
    }
    return points;
  }, [dimensions.width, dimensions.height, gridSize]);

  // Random twinkling effect
  useEffect(() => {
    if (intersections.length === 0) return;

    const twinkle = () => {
      // Randomly select 3-8 dots to twinkle
      const numTwinkles = Math.floor(Math.random() * 6) + 3;
      const newTwinkles: TwinkleState = {};

      for (let i = 0; i < numTwinkles; i++) {
        const randomIndex = Math.floor(Math.random() * intersections.length);
        // Random intensity between 0.3 and 1
        newTwinkles[randomIndex] = Math.random() * 0.7 + 0.3;
      }

      setTwinkleStates(newTwinkles);
    };

    // Initial twinkle
    twinkle();

    // Twinkle at random intervals
    const interval = setInterval(twinkle, 800);

    return () => clearInterval(interval);
  }, [intersections.length]);

  // Calculate distance from mouse to determine sparkle brightness
  const getSparkleOpacity = useCallback((px: number, py: number, index: number) => {
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - px, 2) + Math.pow(mousePosition.y - py, 2)
    );
    const maxDistance = 200;

    // Base opacity from cursor proximity
    let opacity = 0.05;
    if (distance < maxDistance) {
      const intensity = 1 - distance / maxDistance;
      opacity = 0.05 + intensity * 0.5;
    }

    // Add twinkle effect
    if (twinkleStates[index]) {
      opacity = Math.max(opacity, twinkleStates[index] * 0.6);
    }

    return opacity;
  }, [mousePosition.x, mousePosition.y, twinkleStates]);

  const getSparkleScale = useCallback((px: number, py: number, index: number) => {
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - px, 2) + Math.pow(mousePosition.y - py, 2)
    );
    const maxDistance = 200;

    let scale = 1;
    if (distance < maxDistance) {
      const intensity = 1 - distance / maxDistance;
      scale = 1 + intensity * 1.2;
    }

    // Add twinkle scale
    if (twinkleStates[index]) {
      scale = Math.max(scale, 1 + twinkleStates[index] * 0.8);
    }

    return scale;
  }, [mousePosition.x, mousePosition.y, twinkleStates]);

  return (
    <div className={cn("pointer-events-none fixed inset-0 z-0", className)}>
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <pattern
            id={`grid-${id}`}
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border/30"
            />
          </pattern>
          <radialGradient
            id={`spotlight-${id}`}
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={`mask-${id}`}>
            <rect width="100%" height="100%" fill="rgba(255,255,255,0.08)" />
            <circle
              cx={mousePosition.x}
              cy={mousePosition.y}
              r="300"
              fill={`url(#spotlight-${id})`}
              style={{
                transition: "cx 0.15s ease-out, cy 0.15s ease-out",
              }}
            />
          </mask>
        </defs>

        {/* Grid lines */}
        <rect
          width="100%"
          height="100%"
          fill={`url(#grid-${id})`}
          mask={`url(#mask-${id})`}
        />

        {/* Sparkles at intersections */}
        <g className="text-purple-500">
          {intersections.map((point) => {
            const opacity = getSparkleOpacity(point.x, point.y, point.index);
            const scale = getSparkleScale(point.x, point.y, point.index);
            const isTwinkling = twinkleStates[point.index];
            return (
              <circle
                key={point.index}
                cx={point.x}
                cy={point.y}
                r={1.5 * scale}
                fill="currentColor"
                opacity={opacity}
                style={{
                  transition: isTwinkling
                    ? "opacity 0.3s ease-in-out, r 0.3s ease-in-out"
                    : "opacity 0.5s ease-out, r 0.5s ease-out",
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
