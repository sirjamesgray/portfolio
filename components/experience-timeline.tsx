"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";
import { EXPERIENCE } from "@/lib/constants";
import { CARD_INTERACTIVE_SOLID } from "@/lib/cards";

/** Convert color string to rgba with specified opacity (supports HSL and hex) */
function colorWithOpacity(color: string, opacity: number): string {
  // Handle HSL format
  const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (hslMatch) {
    return `hsla(${hslMatch[1]}, ${hslMatch[2]}%, ${hslMatch[3]}%, ${opacity})`;
  }
  // Handle hex format
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
}

export function ExperienceTimeline() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="experience" className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <BlurFade delay={0.1} inView>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              UX Design Experience
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              8 years of designing and building products at high-growth startups.
            </p>
          </div>
        </BlurFade>

        <div className="relative">
          {/* Vertical timeline line - always visible behind everything */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border hidden md:block" />

          <div className="space-y-0">
            {EXPERIENCE.map((job, idx) => (
              <BlurFade key={job.company} delay={0.1 + idx * 0.05} inView>
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Desktop layout */}
                  <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 md:items-stretch">
                    {/* Left side - card or empty based on alternation */}
                    <div className={cn(
                      "flex items-center",
                      idx % 2 === 0 ? "justify-end" : "justify-end"
                    )}>
                      {idx % 2 === 0 ? (
                        <CursorGlow color={job.brandColor}>
                          <div
                            className={cn(
                              `w-full max-w-sm p-4 cursor-default ${CARD_INTERACTIVE_SOLID.base} ${CARD_INTERACTIVE_SOLID.shadow}`,
                              hoveredIndex === idx && "shadow-[var(--shadow-elevation-md)]"
                            )}
                            style={hoveredIndex === idx ? { borderColor: colorWithOpacity(job.brandColor, 0.5) } : undefined}
                          >
                            <div className="flex items-start gap-3">
                              {job.logo && (
                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
                                  <Image
                                    src={job.logo}
                                    alt={`${job.company} logo`}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground">
                                  {job.company}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {job.role}
                                </p>
                                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{job.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CursorGlow>
                      ) : (
                        <div className="w-full max-w-sm" />
                      )}
                    </div>

                    {/* Center - timeline with dates and connecting line */}
                    <div className="relative flex flex-col items-center py-2">
                      {/* Start date */}
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 whitespace-nowrap",
                          hoveredIndex === idx
                            ? "text-white scale-105"
                            : "bg-muted text-muted-foreground"
                        )}
                        style={hoveredIndex === idx ? { backgroundColor: job.brandColor } : undefined}
                      >
                        {job.startDate}
                      </span>

                      {/* Start dot */}
                      <div
                        className={cn(
                          "mt-2 h-3 w-3 rounded-full transition-all duration-300 z-10",
                          hoveredIndex === idx
                            ? "scale-125"
                            : "bg-border"
                        )}
                        style={hoveredIndex === idx ? {
                          backgroundColor: job.brandColor,
                          boxShadow: `0 10px 15px -3px ${colorWithOpacity(job.brandColor, 0.5)}`
                        } : undefined}
                      />

                      {/* Connecting vertical line */}
                      <div
                        className={cn(
                          "w-0.5 flex-1 min-h-12 transition-all duration-300",
                          hoveredIndex !== idx && "bg-border"
                        )}
                        style={hoveredIndex === idx ? {
                          backgroundColor: job.brandColor,
                          boxShadow: `0 0 8px 2px ${colorWithOpacity(job.brandColor, 0.4)}`
                        } : undefined}
                      />

                      {/* End dot */}
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full transition-all duration-300 z-10",
                          hoveredIndex === idx
                            ? "scale-125"
                            : "bg-border"
                        )}
                        style={hoveredIndex === idx ? {
                          backgroundColor: job.brandColor,
                          boxShadow: `0 10px 15px -3px ${colorWithOpacity(job.brandColor, 0.5)}`
                        } : undefined}
                      />

                      {/* End date */}
                      <span
                        className={cn(
                          "mt-2 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 whitespace-nowrap",
                          hoveredIndex === idx
                            ? "text-white scale-105"
                            : "bg-muted text-muted-foreground"
                        )}
                        style={hoveredIndex === idx ? { backgroundColor: job.brandColor } : undefined}
                      >
                        {job.endDate}
                      </span>
                    </div>

                    {/* Right side - card or empty based on alternation */}
                    <div className={cn(
                      "flex items-center",
                      idx % 2 === 1 ? "justify-start" : "justify-start"
                    )}>
                      {idx % 2 === 1 ? (
                        <CursorGlow color={job.brandColor}>
                          <div
                            className={cn(
                              `w-full max-w-sm p-4 cursor-default ${CARD_INTERACTIVE_SOLID.base} ${CARD_INTERACTIVE_SOLID.shadow}`,
                              hoveredIndex === idx && "shadow-[var(--shadow-elevation-md)]"
                            )}
                            style={hoveredIndex === idx ? { borderColor: colorWithOpacity(job.brandColor, 0.5) } : undefined}
                          >
                            <div className="flex items-start gap-3">
                              {job.logo && (
                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
                                  <Image
                                    src={job.logo}
                                    alt={`${job.company} logo`}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground">
                                  {job.company}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {job.role}
                                </p>
                                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{job.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CursorGlow>
                      ) : (
                        <div className="w-full max-w-sm" />
                      )}
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden py-2">
                    <CursorGlow color={job.brandColor}>
                      <div
                        className={cn(
                          `p-4 cursor-default ${CARD_INTERACTIVE_SOLID.base} ${CARD_INTERACTIVE_SOLID.shadow}`,
                          hoveredIndex === idx && "shadow-[var(--shadow-elevation-md)]"
                        )}
                        style={hoveredIndex === idx ? { borderColor: colorWithOpacity(job.brandColor, 0.5) } : undefined}
                      >
                        <div className="flex items-start gap-3">
                          {/* Logo on the left */}
                          {job.logo && (
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
                              <Image
                                src={job.logo}
                                alt={`${job.company} logo`}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          )}
                          {/* Text content container on the right */}
                          <div className="flex-1 min-w-0">
                            {/* Location in top right */}
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-foreground">
                                {job.company}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                <MapPin className="h-3 w-3" />
                                <span>{job.location}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {job.role}
                            </p>
                            {/* Date timeline with arrow */}
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="rounded bg-muted px-2 py-0.5">{job.startDate}</span>
                              <ArrowRight className="h-3 w-3 shrink-0" />
                              <span className="rounded bg-muted px-2 py-0.5">{job.endDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CursorGlow>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
