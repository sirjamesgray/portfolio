"use client";

import { LucideIcon } from "lucide-react";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { CARD_INTERACTIVE_SOLID } from "@/lib/cards";
import { cn } from "@/lib/utils";

export type FeatureCardVariant = "emerald" | "red" | "yellow" | "blue";

const variantStyles: Record<FeatureCardVariant, { bg: string; text: string; ring: string; glow?: string }> = {
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    ring: "ring-emerald-500/20",
  },
  red: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    ring: "ring-red-500/20",
    glow: "hsl(0, 85%, 55%)",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
    ring: "ring-yellow-500/20",
    glow: "hsl(45, 93%, 47%)",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    ring: "ring-blue-500/20",
    glow: "hsl(217, 91%, 60%)",
  },
};

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: FeatureCardVariant;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  variant = "emerald",
  className,
}: FeatureCardProps) {
  const styles = variantStyles[variant];

  return (
    <CursorGlow color={styles.glow}>
      <div className={cn(`${CARD_INTERACTIVE_SOLID.full} p-4 sm:p-6 h-full`, className)}>
        {/* Mobile: horizontal layout | Desktop: vertical layout */}
        <div className="flex items-start gap-4 sm:block">
          <div
            className={cn(
              "flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg ring-1 sm:mb-4",
              styles.bg,
              styles.text,
              styles.ring
            )}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base sm:mb-2">{title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-0">{description}</p>
          </div>
        </div>
      </div>
    </CursorGlow>
  );
}
