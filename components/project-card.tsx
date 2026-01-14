"use client";

import { useState } from "react";
import Image from "next/image";
import { Briefcase, ArrowRight } from "lucide-react";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { cn } from "@/lib/utils";
import { CARD_INTERACTIVE_SOLID } from "@/lib/cards";

export type ProjectCardData = {
  id: string;
  title: string | null;
  public_title: string | null;
  public_description: string | null;
  public_hero_image: string | null;
  public_industry: string | null;
  project_type: string | null;
  icon_url: string | null;
  public_brand_color: string | null;
};

interface ProjectCardProps {
  project: ProjectCardData;
  displayTitle: string;
  displayDescription: string;
  displayIndustry: string;
  isHovered?: boolean;
  onHover?: (hovered: boolean) => void;
  priority?: boolean;
  className?: string;
}

// Convert hex color to rgba with opacity
function hexToRgba(hex: string, opacity: number): string {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Generate glow color from hex
function getGlowColor(hex: string): string {
  return hexToRgba(hex, 0.4);
}

// Default color if none specified
const DEFAULT_COLOR = "#10b981"; // emerald-500

export function ProjectCard({
  project,
  displayTitle,
  displayDescription,
  displayIndustry,
  isHovered = false,
  onHover,
  priority = false,
  className,
}: ProjectCardProps) {
  const [internalHovered, setInternalHovered] = useState(false);
  const hovered = onHover ? isHovered : internalHovered;

  const brandColor = project.public_brand_color || DEFAULT_COLOR;
  const glowColor = getGlowColor(brandColor);

  // Create gradient style using the hex color
  const gradientStyle = {
    background: `linear-gradient(to bottom right, ${hexToRgba(brandColor, hovered ? 0.25 : 0.15)}, ${hexToRgba(brandColor, hovered ? 0.1 : 0.05)}, transparent)`,
  };

  const handleMouseEnter = () => {
    if (onHover) {
      onHover(true);
    } else {
      setInternalHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (onHover) {
      onHover(false);
    } else {
      setInternalHovered(false);
    }
  };

  return (
    <CursorGlow color={glowColor}>
      <div
        className={cn(
          `group relative p-4 overflow-hidden h-full ${CARD_INTERACTIVE_SOLID.base} ${CARD_INTERACTIVE_SOLID.shadow}`,
          hovered && "border-primary/50 bg-primary/5 shadow-[var(--shadow-elevation-md)]",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={gradientStyle}
        />

        <div className="relative">
          {/* Hero Image */}
          {project.public_hero_image && (
            <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4 bg-white/5">
              <Image
                src={project.public_hero_image}
                alt={displayTitle}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={priority}
              />
            </div>
          )}

          {/* Content row: Logo | Text | Arrow */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 overflow-hidden",
                hovered
                  ? "bg-primary/20 text-primary"
                  : "bg-white/10 text-muted-foreground"
              )}
            >
              {project.icon_url ? (
                <Image
                  src={project.icon_url}
                  alt={displayTitle}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Briefcase className="h-6 w-6" />
              )}
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground">
                {displayTitle}
              </h3>
              <p className="text-xs text-muted-foreground mb-1">
                {displayIndustry}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {displayDescription}
              </p>
            </div>

            {/* Arrow */}
            <ArrowRight
              className={cn(
                "h-5 w-5 shrink-0 transition-all duration-300",
                hovered ? "text-primary translate-x-1" : "text-muted-foreground"
              )}
            />
          </div>
        </div>
      </div>
    </CursorGlow>
  );
}
