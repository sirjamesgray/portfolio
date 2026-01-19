"use client";

import { useState } from "react";
import Image from "next/image";
import { Palette, ExternalLink } from "lucide-react";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { cn } from "@/lib/utils";
import { CARD_INTERACTIVE_SOLID } from "@/lib/cards";

export type DesignSystemCardData = {
  id: string;
  title?: string | null;
  public_title: string | null;
  public_description?: string | null;
  design_system_description?: string | null;
  icon_url: string | null;
  public_brand_color: string | null;
  public_design_system_url: string | null;
  design_system_image_url: string | null;
};

interface DesignSystemCardProps {
  project: DesignSystemCardData;
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

export function DesignSystemCard({
  project,
  priority = false,
  className,
}: DesignSystemCardProps) {
  const [hovered, setHovered] = useState(false);

  const brandColor = project.public_brand_color || DEFAULT_COLOR;
  const glowColor = getGlowColor(brandColor);
  const displayTitle = project.public_title || project.title || "Untitled Project";

  // Create gradient style using the hex color
  const gradientStyle = {
    background: `linear-gradient(to bottom right, ${hexToRgba(brandColor, hovered ? 0.25 : 0.15)}, ${hexToRgba(brandColor, hovered ? 0.1 : 0.05)}, transparent)`,
  };

  if (!project.public_design_system_url) return null;

  return (
    <a
      href={project.public_design_system_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <CursorGlow color={glowColor}>
        <div
          className={cn(
            `group relative p-4 overflow-hidden h-full ${CARD_INTERACTIVE_SOLID.base} ${CARD_INTERACTIVE_SOLID.shadow}`,
            hovered && "border-primary/50 bg-primary/5 shadow-[var(--shadow-elevation-md)]",
            className
          )}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={gradientStyle}
          />

          <div className="relative">
            {/* Design System Image */}
            {project.design_system_image_url ? (
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden mb-4 bg-white/5">
                <Image
                  src={project.design_system_image_url}
                  alt={`${displayTitle} design system`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={priority}
                />
                {/* Icon badge overlay */}
                {project.icon_url && (
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg overflow-hidden bg-black/50 backdrop-blur-sm shadow-lg">
                    <Image
                      src={project.icon_url}
                      alt={displayTitle}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            ) : (
              // Placeholder when no image
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden mb-4 bg-muted/50 flex items-center justify-center">
                <Palette className="h-12 w-12 text-muted-foreground/50" />
                {/* Icon badge overlay */}
                {project.icon_url && (
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg overflow-hidden bg-black/50 backdrop-blur-sm shadow-lg">
                    <Image
                      src={project.icon_url}
                      alt={displayTitle}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Title and link indicator */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {displayTitle}
                </h3>
                {(project.design_system_description || project.public_description) && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {project.design_system_description || project.public_description}
                  </p>
                )}
              </div>
              <ExternalLink
                className={cn(
                  "h-4 w-4 shrink-0 transition-all duration-300",
                  hovered ? "text-primary translate-x-0.5 -translate-y-0.5" : "text-muted-foreground"
                )}
              />
            </div>
          </div>
        </div>
      </CursorGlow>
    </a>
  );
}
