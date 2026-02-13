"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * @deprecated Archived background - use LandingBackground instead
 * Animated sparkling grid with cursor tracking and pulsing lines.
 */
interface SparklingGridProps {
  className?: string;
  gridSize?: number;
  /** When true, uses absolute positioning for container use instead of fixed viewport */
  contained?: boolean;
}

// Only track actively animating dots (sparse representation)
interface ActiveDot {
  index: number;
  triggeredAt: number;
  intensity: number;
}

interface Pulse {
  id: number;
  x: number;
  y: number;
  direction: "horizontal" | "vertical";
  progress: number;
  speed: number;
  opacity: number;
  length: number;
}

// Animation timing constants
const FLASH_DURATION = 150;
const SETTLE_DURATION = 300;
const GREEN_HOLD_DURATION = 800;
const DEFLATE_DURATION = 600;
const TOTAL_DURATION = FLASH_DURATION + SETTLE_DURATION + GREEN_HOLD_DURATION + DEFLATE_DURATION;

// Throttle animation updates to ~30fps instead of 60fps for better performance
const ANIMATION_INTERVAL = 33;

export function SparklingGrid({ className, gridSize = 40, contained = false }: SparklingGridProps) {
  // Use a stable ID to avoid hydration mismatch (useId generates different IDs on server vs client)
  const id = "cursor-grid";
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [activeDots, setActiveDots] = useState<ActiveDot[]>([]);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const pulseIdCounter = useRef(0);
  const lastAnimationTime = useRef(0);

  // Calculate grid dimensions
  const gridDimensions = useMemo(() => {
    const cols = Math.ceil(dimensions.width / gridSize) + 1;
    const rows = Math.ceil(dimensions.height / gridSize) + 1;
    return { cols, rows, total: cols * rows };
  }, [dimensions.width, dimensions.height, gridSize]);

  useEffect(() => {
    const updateDimensions = () => {
      if (contained && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      } else {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }
    };

    // Throttle mouse move updates
    let lastMoveTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime > 16) { // ~60fps max for mouse
        if (contained && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        } else {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }
        lastMoveTime = now;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const now = Date.now();
        if (now - lastMoveTime > 16) {
          if (contained && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setMousePosition({ x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top });
          } else {
            setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
          }
          lastMoveTime = now;
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        if (contained && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setMousePosition({ x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top });
        } else {
          setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [contained]);

  // Combined animation loop - handles both dots and pulses in one rAF
  useEffect(() => {
    if (gridDimensions.total === 0) return;

    let frameId: number;
    let lastTriggerTime = 0;

    const animate = (timestamp: number) => {
      const now = Date.now();

      // Only update if enough time has passed (throttle to ~30fps)
      if (now - lastAnimationTime.current >= ANIMATION_INTERVAL) {
        lastAnimationTime.current = now;

        // Update active dots - remove completed animations
        setActiveDots(prev => prev.filter(dot => now - dot.triggeredAt < TOTAL_DURATION));

        // Update pulses
        setPulses(prev => {
          if (prev.length === 0) return prev;
          return prev
            .map(pulse => ({
              ...pulse,
              progress: pulse.progress + pulse.speed * 2, // Compensate for lower framerate
            }))
            .filter(pulse => {
              if (pulse.direction === "horizontal") {
                return pulse.progress < dimensions.width + pulse.length;
              } else {
                return pulse.progress < dimensions.height + pulse.length;
              }
            });
        });

        // Trigger new dots periodically (every ~800ms)
        if (now - lastTriggerTime > 800) {
          lastTriggerTime = now;
          const numTriggers = Math.floor(Math.random() * 6) + 3;

          setActiveDots(prev => {
            const activeIndices = new Set(prev.map(d => d.index));
            const newDots: ActiveDot[] = [];

            for (let i = 0; i < numTriggers; i++) {
              const randomIndex = Math.floor(Math.random() * gridDimensions.total);
              if (!activeIndices.has(randomIndex)) {
                newDots.push({
                  index: randomIndex,
                  triggeredAt: now,
                  intensity: Math.random() * 0.7 + 0.3,
                });
                activeIndices.add(randomIndex);
              }
            }

            return [...prev, ...newDots];
          });
        }
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [gridDimensions.total, dimensions.width, dimensions.height]);

  // Create pulses at intervals (separate from animation loop to reduce complexity)
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const createPulse = () => {
      const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
      const cols = Math.ceil(dimensions.width / gridSize);
      const rows = Math.ceil(dimensions.height / gridSize);

      const newPulse: Pulse = {
        id: pulseIdCounter.current++,
        x: direction === "horizontal" ? 0 : Math.floor(Math.random() * cols) * gridSize,
        y: direction === "vertical" ? 0 : Math.floor(Math.random() * rows) * gridSize,
        direction,
        progress: 0,
        speed: 0.5 + Math.random() * 1,
        opacity: 0.3 + Math.random() * 0.4,
        length: 40 + Math.random() * 80,
      };

      setPulses(prev => [...prev, newPulse]);
    };

    // Create initial pulses
    for (let i = 0; i < 3; i++) {
      setTimeout(createPulse, i * 500);
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.3) createPulse();
    }, 1500);

    return () => clearInterval(interval);
  }, [dimensions.width, dimensions.height, gridSize]);

  // Calculate dot appearance - memoized calculation function
  const getDotAppearance = useCallback((triggeredAt: number, intensity: number, now: number) => {
    const elapsed = now - triggeredAt;

    if (elapsed < FLASH_DURATION) {
      const t = elapsed / FLASH_DURATION;
      const bounce = 1 + (0.8 + 0.5 * Math.sin(t * Math.PI)) * intensity;
      return { opacity: 0.3 + 0.7 * intensity, scale: bounce, isGreen: true };
    }

    if (elapsed < FLASH_DURATION + SETTLE_DURATION) {
      const t = (elapsed - FLASH_DURATION) / SETTLE_DURATION;
      const settledScale = 1 + 0.3 * intensity;
      const bounceScale = 1 + 0.8 * intensity;
      return { opacity: 0.3 + 0.5 * intensity, scale: bounceScale - (bounceScale - settledScale) * t, isGreen: true };
    }

    if (elapsed < FLASH_DURATION + SETTLE_DURATION + GREEN_HOLD_DURATION) {
      return { opacity: 0.3 + 0.4 * intensity, scale: 1 + 0.3 * intensity, isGreen: true };
    }

    const deflateElapsed = elapsed - (FLASH_DURATION + SETTLE_DURATION + GREEN_HOLD_DURATION);
    const t = deflateElapsed / DEFLATE_DURATION;
    const eased = t * t * (3 - 2 * t);
    const greenScale = 1 + 0.3 * intensity;
    const greenOpacity = 0.3 + 0.4 * intensity;

    return {
      opacity: greenOpacity - (greenOpacity - 0.15) * eased,
      scale: greenScale - (greenScale - 1) * eased,
      isGreen: t < 0.5,
    };
  }, []);

  // Memoize the active dots rendering
  const now = Date.now();
  const renderedDots = useMemo(() => {
    return activeDots.map(dot => {
      const { opacity, scale, isGreen } = getDotAppearance(dot.triggeredAt, dot.intensity, now);
      const col = dot.index % gridDimensions.cols;
      const row = Math.floor(dot.index / gridDimensions.cols);
      return (
        <circle
          key={dot.index}
          cx={col * gridSize}
          cy={row * gridSize}
          r={1 * scale}
          fill={isGreen ? "rgb(16, 185, 129)" : "rgb(156, 163, 175)"}
          opacity={opacity}
        />
      );
    });
  }, [activeDots, gridDimensions.cols, gridSize, getDotAppearance, now]);

  return (
    <div ref={containerRef} className={cn("pointer-events-none inset-0 z-0", contained ? "absolute" : "fixed", className)}>
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
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
          <radialGradient id={`spotlight-${id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
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
              style={{ transition: "cx 0.15s ease-out, cy 0.15s ease-out" }}
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

        {/* Animated pulses along grid lines */}
        <g className="text-emerald-500 dark:text-emerald-400">
          {pulses.map((pulse) => {
            const gradientId = `pulse-gradient-${pulse.id}`;
            const isHorizontal = pulse.direction === "horizontal";

            return (
              <g key={pulse.id}>
                <defs>
                  <linearGradient
                    id={gradientId}
                    x1="0%"
                    y1="0%"
                    x2={isHorizontal ? "100%" : "0%"}
                    y2={isHorizontal ? "0%" : "100%"}
                  >
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                    <stop offset="30%" stopColor="currentColor" stopOpacity={pulse.opacity} />
                    <stop offset="70%" stopColor="currentColor" stopOpacity={pulse.opacity} />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line
                  x1={isHorizontal ? pulse.progress : pulse.x}
                  y1={isHorizontal ? pulse.y : pulse.progress}
                  x2={isHorizontal ? pulse.progress + pulse.length : pulse.x}
                  y2={isHorizontal ? pulse.y : pulse.progress + pulse.length}
                  stroke={`url(#${gradientId})`}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </g>

        {/* Only render actively animating dots (sparse rendering) */}
        <g>{renderedDots}</g>
      </svg>
    </div>
  );
}
