"use client";

import { CursorGrid } from "@/components/cursor-grid";
import { cn } from "@/lib/utils";

interface LandingBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Landing page background with gradient and animated cursor grid.
 *
 * Features:
 * - Subtle blue gradient in the bottom-right corner
 * - Animated dot grid that follows cursor
 * - Pulsing lines that travel across the grid
 * - Random sparkle effects on grid intersections
 *
 * Usage:
 * ```tsx
 * <LandingBackground>
 *   <YourContent />
 * </LandingBackground>
 * ```
 */
export function LandingBackground({ children, className }: LandingBackgroundProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30",
        className
      )}
    >
      <CursorGrid />
      {children}
    </div>
  );
}
