"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RotatingCubeIcon } from "./rotating-cube-icon";

export type IconStyle = "app" | "cube";
export type IconVariant = "emerald" | "red" | "yellow" | "blue" | "muted";

interface SectionHeaderProps {
  /** Lucide icon to display above the title */
  icon?: LucideIcon;
  /** Icon color variant */
  iconVariant?: IconVariant;
  /** Icon display style: "app" (solid bg) or "cube" (rotating outline cube) */
  iconStyle?: IconStyle;
  /** Section title */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Additional CSS classes */
  className?: string;
  /** Children to render below subtitle (like taglines) */
  children?: React.ReactNode;
}

const appIconVariants = {
  emerald: "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20",
  red: "bg-red-500/10 text-red-500 ring-1 ring-red-500/20",
  yellow: "bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20",
  blue: "bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20",
  muted: "bg-muted text-muted-foreground ring-1 ring-border",
};

function AppStyleIcon({ icon: Icon, variant }: { icon: LucideIcon; variant: IconVariant }) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl",
        appIconVariants[variant]
      )}
    >
      <Icon className="h-6 w-6" />
    </div>
  );
}

export function SectionHeader({
  icon: Icon,
  iconVariant = "emerald",
  iconStyle = "cube",
  title,
  subtitle,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-10 text-center", className)}>
      {Icon && (
        <div className="mb-4 flex justify-center">
          {iconStyle === "cube" ? (
            <RotatingCubeIcon icon={Icon} variant={iconVariant} size="md" />
          ) : (
            <AppStyleIcon icon={Icon} variant={iconVariant} />
          )}
        </div>
      )}
      <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto max-w-xl text-muted-foreground">{subtitle}</p>
      )}
      {children}
    </div>
  );
}
