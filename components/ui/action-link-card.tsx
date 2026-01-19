"use client";

import Link from "next/link";
import { LucideIcon, ChevronRight } from "lucide-react";
import { TwinklingSparkles } from "@/components/twinkling-sparkles";
import { cn } from "@/lib/utils";
import { ComponentType } from "react";

/** Icon component that accepts className prop */
type IconComponent = LucideIcon | ComponentType<{ className?: string }>;

export interface ActionLinkCardProps {
  title: string;
  description?: string;
  icon: IconComponent;
  href: string;
  external?: boolean;
  primary?: boolean;
  className?: string;
}

export function ActionLinkCard({
  title,
  description,
  icon: Icon,
  href,
  external = false,
  primary = false,
  className,
}: ActionLinkCardProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 rounded-xl border transition-all",
        primary
          ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-[var(--shadow-glow-emerald)] hover:shadow-[var(--shadow-glow-emerald-hover)]"
          : "bg-card hover:bg-muted/50 border-border shadow-[var(--shadow-elevation-md)] hover:shadow-[var(--shadow-elevation-md)]",
        className
      )}
    >
      {/* White sparkles for primary CTA */}
      {primary && <TwinklingSparkles forceShow />}

      <div
        className={cn(
          "relative flex-shrink-0 p-3 rounded-lg w-fit",
          primary ? "bg-white/20" : "bg-emerald-500/10"
        )}
      >
        <Icon
          className={cn(
            "h-6 w-6",
            primary ? "text-white" : "text-emerald-600 dark:text-emerald-400"
          )}
        />
      </div>

      <div className="relative flex-1 min-w-0">
        <h2
          className={cn(
            "text-lg font-semibold",
            primary ? "text-white" : "text-foreground"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "text-sm",
              primary ? "text-white/80" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
      </div>

      <div
        className={cn(
          "absolute right-6 top-1/2 -translate-y-1/2 sm:relative sm:right-auto sm:top-auto sm:translate-y-0 flex-shrink-0 transition-transform group-hover:translate-x-1",
          primary ? "text-white/80" : "text-muted-foreground"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </div>
    </Link>
  );
}
