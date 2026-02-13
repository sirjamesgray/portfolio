import { cn } from "@/lib/utils";

interface LandingBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Landing page background wrapper.
 *
 * Currently renders a solid black (dark) / white (light) background.
 * Designed to support swappable background variants in the future
 * (e.g., shader effects, gradients, patterns).
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
        "relative min-h-screen bg-background",
        className
      )}
    >
      {children}
    </div>
  );
}
