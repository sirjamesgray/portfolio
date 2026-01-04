"use client";

import { useEffect, useState, useId, useMemo } from "react";
import { cn } from "@/lib/utils";

interface CursorGridProps {
  className?: string;
  gridSize?: number;
}

export function CursorGrid({ className, gridSize = 40 }: CursorGridProps) {
  const id = useId();
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
    const points: { x: number; y: number }[] = [];
    const cols = Math.ceil(dimensions.width / gridSize) + 1;
    const rows = Math.ceil(dimensions.height / gridSize) + 1;

    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        points.push({
          x: col * gridSize,
          y: row * gridSize,
        });
      }
    }
    return points;
  }, [dimensions.width, dimensions.height, gridSize]);

  // Calculate distance from mouse to determine sparkle brightness
  const getSparkleOpacity = (px: number, py: number) => {
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - px, 2) + Math.pow(mousePosition.y - py, 2)
    );
    const maxDistance = 150;
    if (distance > maxDistance) return 0.03;
    const intensity = 1 - distance / maxDistance;
    return 0.03 + intensity * 0.4;
  };

  const getSparkleScale = (px: number, py: number) => {
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - px, 2) + Math.pow(mousePosition.y - py, 2)
    );
    const maxDistance = 150;
    if (distance > maxDistance) return 1;
    const intensity = 1 - distance / maxDistance;
    return 1 + intensity * 0.8;
  };

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
              className="text-border/40"
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
          <radialGradient
            id={`sparkle-${id}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <mask id={`mask-${id}`}>
            <rect width="100%" height="100%" fill="rgba(255,255,255,0.12)" />
            <circle
              cx={mousePosition.x}
              cy={mousePosition.y}
              r="250"
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
        <g className="text-primary">
          {intersections.map((point, i) => {
            const opacity = getSparkleOpacity(point.x, point.y);
            const scale = getSparkleScale(point.x, point.y);
            return (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r={1 * scale}
                fill="currentColor"
                opacity={opacity}
                style={{
                  transition: "opacity 0.2s ease-out, r 0.2s ease-out",
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
