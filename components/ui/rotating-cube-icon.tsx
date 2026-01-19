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
  emerald: "border-emerald-500/50",
  red: "border-red-500/50",
  yellow: "border-yellow-500/50",
  blue: "border-blue-500/50",
  muted: "border-border/50",
};

const iconVariants = {
  emerald: "text-emerald-500",
  red: "text-red-500",
  yellow: "text-yellow-500",
  blue: "text-blue-500",
  muted: "text-muted-foreground",
};

const sizeConfig = {
  sm: { container: "h-10 w-10", cubeSize: 28, icon: "h-4 w-4" },
  md: { container: "h-12 w-12", cubeSize: 36, icon: "h-5 w-5" },
  lg: { container: "h-16 w-16", cubeSize: 48, icon: "h-7 w-7" },
};

export function RotatingCubeIcon({
  icon: Icon,
  variant = "emerald",
  size = "md",
  className,
}: RotatingCubeIconProps) {
  const sizes = sizeConfig[size];
  const cubeSize = sizes.cubeSize;
  const halfSize = cubeSize / 2;

  // Face styles for each side of the cube
  const faceBaseStyle = {
    position: "absolute" as const,
    width: cubeSize,
    height: cubeSize,
    backfaceVisibility: "visible" as const,
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizes.container,
        className
      )}
      style={{ perspective: "150px" }}
    >
      {/* 3D Cube Container */}
      <div
        className="absolute animate-[spin-cube_10s_linear_infinite]"
        style={{
          width: cubeSize,
          height: cubeSize,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front face */}
        <div
          className={cn("border", cubeVariants[variant])}
          style={{
            ...faceBaseStyle,
            transform: `translateZ(${halfSize}px)`,
          }}
        />
        {/* Back face */}
        <div
          className={cn("border", cubeVariants[variant])}
          style={{
            ...faceBaseStyle,
            transform: `translateZ(-${halfSize}px) rotateY(180deg)`,
          }}
        />
        {/* Left face */}
        <div
          className={cn("border", cubeVariants[variant])}
          style={{
            ...faceBaseStyle,
            transform: `translateX(-${halfSize}px) rotateY(-90deg)`,
          }}
        />
        {/* Right face */}
        <div
          className={cn("border", cubeVariants[variant])}
          style={{
            ...faceBaseStyle,
            transform: `translateX(${halfSize}px) rotateY(90deg)`,
          }}
        />
        {/* Top face */}
        <div
          className={cn("border", cubeVariants[variant])}
          style={{
            ...faceBaseStyle,
            transform: `translateY(-${halfSize}px) rotateX(90deg)`,
          }}
        />
        {/* Bottom face */}
        <div
          className={cn("border", cubeVariants[variant])}
          style={{
            ...faceBaseStyle,
            transform: `translateY(${halfSize}px) rotateX(-90deg)`,
          }}
        />
      </div>

      {/* Icon in center */}
      <Icon className={cn(sizes.icon, iconVariants[variant], "relative z-10")} />
    </div>
  );
}
