"use client";

import Link from "next/link";
import { LucideIcon, ChevronRight } from "lucide-react";
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
        "group relative flex min-h-11 items-center gap-4 border p-4 sm:p-6",
        primary
          ? "border-brand bg-brand text-black hover:bg-[#30a46c]"
          : "border-[rgb(61_214_140/0.4)] bg-black hover:border-brand",
        className
      )}
    >
      {/* White sparkles for primary CTA */}

      <div
        className={cn(
          "relative flex-shrink-0 p-2.5 sm:p-3 rounded-lg",
          primary ? "border border-black/40" : "border border-[rgb(61_214_140/0.4)]"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 sm:h-6 sm:w-6",
            primary ? "text-black" : "text-brand"
          )}
        />
      </div>

      <div className="relative flex-1 min-w-0">
        <h2
          className={cn(
            "text-base sm:text-lg font-semibold",
            primary ? "text-black" : "text-foreground"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "text-xs sm:text-sm mt-0.5",
              primary ? "text-black/80" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
      </div>

      <div
        className={cn(
          "flex-shrink-0 transition-transform group-hover:translate-x-1",
          primary ? "text-black/80" : "text-muted-foreground"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </div>
    </Link>
  );
}
