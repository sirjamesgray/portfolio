"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RotatingCubeIconProps {
  /** Lucide icon to display inside the cube */
  icon: LucideIcon;
  /** Color variant for the cube outline */
  variant?: "emerald" | "red" | "yellow" | "blue" | "muted";
  /** Size of the cube */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

const cubeVariants = {
  emerald: "border-emerald-500/60",
  red: "border-red-500/60",
  yellow: "border-yellow-500/60",
  blue: "border-blue-500/60",
  muted: "border-border",
};

const iconVariants = {
  emerald: "text-emerald-500",
  red: "text-red-500",
  yellow: "text-yellow-500",
  blue: "text-blue-500",
  muted: "text-muted-foreground",
};

const sizeConfig = {
  sm: { container: "h-10 w-10", cube: "h-8 w-8", icon: "h-4 w-4" },
  md: { container: "h-12 w-12", cube: "h-10 w-10", icon: "h-5 w-5" },
  lg: { container: "h-16 w-16", cube: "h-14 w-14", icon: "h-7 w-7" },
};

export function RotatingCubeIcon({
  icon: Icon,
  variant = "emerald",
  size = "md",
  className,
}: RotatingCubeIconProps) {
  const sizes = sizeConfig[size];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizes.container,
        className
      )}
      style={{ perspective: "200px" }}
    >
      {/* Rotating 3D cube outline */}
      <div
        className={cn(
          "absolute border-2 rounded-lg animate-[spin3d_8s_linear_infinite]",
          sizes.cube,
          cubeVariants[variant]
        )}
        style={{
          transformStyle: "preserve-3d",
        }}
      />
      {/* Second cube face for depth effect */}
      <div
        className={cn(
          "absolute border-2 rounded-lg animate-[spin3d_8s_linear_infinite]",
          sizes.cube,
          cubeVariants[variant],
          "opacity-50"
        )}
        style={{
          transformStyle: "preserve-3d",
          animationDelay: "-4s",
        }}
      />
      {/* Icon in center */}
      <Icon className={cn(sizes.icon, iconVariants[variant], "relative z-10")} />
    </div>
  );
}
