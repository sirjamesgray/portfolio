"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Briefcase, ArrowRight, Globe, Palette, FileText } from "lucide-react";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { LandingButton } from "@/components/ui/landing-button";
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
  // Optional URL fields for detailed variant
  public_live_url?: string | null;
  show_live_link?: boolean;
  public_design_system_url?: string | null;
  show_design_system_link?: boolean;
  public_content_html?: string | null;
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
  /** "simple" for landing page (clickable card), "detailed" for projects page (with action buttons) */
  variant?: "simple" | "detailed";
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
  variant = "simple",
}: ProjectCardProps) {
  const [internalHovered, setInternalHovered] = useState(false);
  const hovered = onHover ? isHovered : internalHovered;

  const brandColor = project.public_brand_color || DEFAULT_COLOR;
  const glowColor = getGlowColor(brandColor);

  // Determine which buttons to show for detailed variant
  const hasContent = !!project.public_content_html;
  const hasLiveUrl = project.show_live_link && project.public_live_url;
  const hasDesignSystem = project.show_design_system_link && project.public_design_system_url;

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

          {/* Content row: Logo | Text | Arrow (simple) or just Logo | Text (detailed) */}
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

            {/* Arrow - only for simple variant */}
            {variant === "simple" && (
              <ArrowRight
                className={cn(
                  "h-5 w-5 shrink-0 transition-all duration-300",
                  hovered ? "text-primary translate-x-1" : "text-muted-foreground"
                )}
              />
            )}
          </div>

          {/* Action buttons - only for detailed variant */}
          {variant === "detailed" && (
            <div className="flex flex-wrap gap-2 mt-4">
              {hasContent && (
                <Link href={`/projects/${project.id}`}>
                  <LandingButton variant="secondary" size="sm" className="gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Read blog post
                  </LandingButton>
                </Link>
              )}
              {hasLiveUrl && (
                <a
                  href={project.public_live_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LandingButton variant="primary" size="sm" className="gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    View site
                  </LandingButton>
                </a>
              )}
              {hasDesignSystem && (
                <a
                  href={project.public_design_system_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LandingButton variant="secondary" size="sm" className="gap-1.5">
                    <Palette className="h-3.5 w-3.5" />
                    View design system
                  </LandingButton>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </CursorGlow>
  );
}
