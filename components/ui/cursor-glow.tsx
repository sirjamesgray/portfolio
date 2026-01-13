"use client";

import { useRef, useState, useEffect, cloneElement, isValidElement, type ReactElement } from "react";
import { useSparkles } from "@/lib/sparkle-context";

interface CursorGlowProps {
  children: ReactElement;
  /** Color of the glow effect (CSS color value). Defaults to emerald. */
  color?: string;
  /** Size of the glow radius in pixels. Defaults to 500. */
  size?: number;
  /** Opacity of the background glow (0-1). Defaults to 0.06. */
  opacity?: number;
  /** Whether the glow effect is disabled */
  disabled?: boolean;
  /** Distance in pixels to start glowing before cursor reaches card. Defaults to 100. */
  proximityDistance?: number;
  /** Use white/light glow to brighten instead of colored glow. Ideal for CTA cards with colored backgrounds. */
  brighten?: boolean;
  /** Enable sparkles on this card. Respects global SparkleProvider context. */
  sparkle?: boolean;
  /** Number of sparkles. Defaults to 12. */
  sparkleCount?: number;
}

/** Default emerald glow color */
const DEFAULT_GLOW_COLOR = "hsl(145, 80%, 45%)";

/** Preset color palette for easy reuse */
export const GLOW_COLORS = {
  emerald: "hsl(145, 80%, 45%)",
  orange: "hsl(25, 95%, 55%)",
  cyan: "hsl(190, 95%, 45%)",
  purple: "hsl(270, 80%, 55%)",
  pink: "hsl(330, 85%, 55%)",
  amber: "hsl(35, 95%, 55%)",
  rose: "hsl(350, 85%, 55%)",
  blue: "hsl(210, 95%, 55%)",
} as const;

/**
 * CursorGlow - A high-performance cursor-following glow effect
 *
 * This component does NOT add any wrapper elements - it clones the child
 * and injects glow elements directly, preserving grid/flex layouts.
 *
 * Usage:
 * ```tsx
 * <CursorGlow>
 *   <div className="p-4 rounded-xl border">Content</div>
 * </CursorGlow>
 * ```
 */
export function CursorGlow({
  children,
  color = DEFAULT_GLOW_COLOR,
  size = 500,
  opacity = 0.06,
  disabled = false,
  proximityDistance = 100,
  brighten = false,
  sparkle = false,
  sparkleCount = 12,
}: CursorGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const borderGlowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [isNear, setIsNear] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { sparklesEnabled } = useSparkles();
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  // Generate sparkles once on mount
  useEffect(() => {
    if (sparkle) {
      const newSparkles = Array.from({ length: sparkleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        size: Math.random() * 2 + 1,
      }));
      setSparkles(newSparkles);
    }
  }, [sparkle, sparkleCount]);

  // Document-level mouse tracking for proximity detection
  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !glowRef.current || !borderGlowRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      // Calculate distance to the card (including proximity zone)
      const expandedRect = {
        left: rect.left - proximityDistance,
        right: rect.right + proximityDistance,
        top: rect.top - proximityDistance,
        bottom: rect.bottom + proximityDistance,
      };

      const isInProximity =
        e.clientX >= expandedRect.left &&
        e.clientX <= expandedRect.right &&
        e.clientY >= expandedRect.top &&
        e.clientY <= expandedRect.bottom;

      if (isInProximity) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
          if (!glowRef.current || !borderGlowRef.current || !containerRef.current) return;

          const currentRect = containerRef.current.getBoundingClientRect();
          const x = e.clientX - currentRect.left;
          const y = e.clientY - currentRect.top;

          const transform = `translate(${x}px, ${y}px)`;
          glowRef.current.style.transform = transform;
          borderGlowRef.current.style.transform = transform;
        });

        if (!isNear) {
          setIsNear(true);
        }
      } else if (isNear) {
        setIsNear(false);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [disabled, isNear, proximityDistance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const borderSize = size * 0.5;

  // Use white for brighten mode (for CTA cards with colored backgrounds)
  const glowColor = brighten ? "rgba(255, 255, 255, 0.9)" : color;
  const brightenOpacity = brighten ? 0.15 : opacity;
  const brightenBorderOpacity = brighten ? 0.3 : 0.2;

  // Should sparkles be shown?
  const showSparkles = sparkle && sparklesEnabled;

  // Glow elements to inject - wrapped in overflow-hidden container so badges can extend outside card
  const glowElements = (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none z-0">
      {/* Background glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute will-change-transform transition-opacity duration-300"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity: isNear ? brightenOpacity : 0,
          filter: "blur(60px)",
        }}
      />
      {/* Border glow */}
      <div
        ref={borderGlowRef}
        className="pointer-events-none absolute will-change-transform transition-opacity duration-300"
        style={{
          width: borderSize,
          height: borderSize,
          marginLeft: -borderSize / 2,
          marginTop: -borderSize / 2,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 60%)`,
          opacity: isNear ? brightenBorderOpacity : 0,
          filter: "blur(30px)",
        }}
      />
      {/* Sparkles */}
      {showSparkles && sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle z-10"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );

  // Clone the child and inject glow elements + ref
  if (!isValidElement(children)) {
    return children;
  }

  // Get existing className and style from child
  const childProps = children.props as Record<string, unknown>;
  const existingClassName = (childProps.className as string) || "";
  const existingStyle = (childProps.style as React.CSSProperties) || {};
  const existingOnMouseEnter = childProps.onMouseEnter as ((e: React.MouseEvent) => void) | undefined;
  const existingOnMouseLeave = childProps.onMouseLeave as ((e: React.MouseEvent) => void) | undefined;

  // Convert HSL color to a semi-transparent version for the border
  // Parse the HSL and add alpha for border highlight
  const getBorderColor = (hslColor: string, alpha: number, useBrighten: boolean) => {
    // Use white border for brighten mode
    if (useBrighten) {
      return `rgba(255, 255, 255, ${alpha})`;
    }
    // If it's already in hsl() format, convert to hsla()
    if (hslColor.startsWith("hsl(")) {
      const values = hslColor.slice(4, -1);
      return `hsla(${values}, ${alpha})`;
    }
    return hslColor;
  };

  // Handle mouse enter/leave for border highlight (separate from proximity glow)
  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovering(true);
    existingOnMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    setIsHovering(false);
    existingOnMouseLeave?.(e);
  };

  return cloneElement(children, {
    ref: containerRef,
    className: `${existingClassName} relative transition-[border-color]`.trim(),
    style: {
      ...existingStyle,
      position: "relative" as const,
      transitionDuration: "300ms",
      // Apply matching border color only when actually hovering (not just near)
      ...(isHovering && {
        borderColor: getBorderColor(color, 0.5, brighten),
      }),
    },
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    children: (
      <>
        {glowElements}
        {childProps.children}
      </>
    ),
  } as Partial<unknown>);
}
