"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { LandingBackground } from "@/components/landing-background";
import { LandingButton } from "@/components/ui/landing-button";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { cn } from "@/lib/utils";
import { EXPERIENCE, PRODUCT_ENGINEER_CTA } from "@/lib/constants";
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

export default function ExperiencePage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <LandingBackground className="flex flex-col">
      <SiteHeader />

      <main className="flex-1 pt-20 pb-16">
        <div className="mx-auto max-w-5xl px-6">
          <BlurFade delay={0.1}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </BlurFade>

          <BlurFade delay={0.15}>
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Experience
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                8 years of designing and building products at high-growth startups.
              </p>
            </div>
          </BlurFade>

          {/* Grid layout */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXPERIENCE.map((job, idx) => (
              <BlurFade key={job.company} delay={0.1 + idx * 0.05}>
                <CursorGlow color={job.brandColor}>
                  <div
                    className={cn(
                      `h-full p-4 cursor-default ${CARD_INTERACTIVE_SOLID.base} ${CARD_INTERACTIVE_SOLID.shadow}`,
                      hoveredIndex === idx && "shadow-[var(--shadow-elevation-md)]"
                    )}
                    style={hoveredIndex === idx ? { borderColor: colorWithOpacity(job.brandColor, 0.5) } : undefined}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="flex items-start gap-3">
                      {job.logo && (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
                          <Image
                            src={job.logo}
                            alt={`${job.company} logo`}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
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
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="rounded bg-muted px-2 py-0.5">{job.startDate}</span>
                          <ArrowRight className="h-3 w-3 shrink-0" />
                          <span className="rounded bg-muted px-2 py-0.5">{job.endDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CursorGlow>
              </BlurFade>
            ))}
          </div>

          {/* CTA Card */}
          <BlurFade delay={0.3}>
            <div className={`${CARD_INTERACTIVE_SOLID.full} mt-12 p-8 text-center`}>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Looking to hire?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                I&apos;m available for product design and engineering roles. Let&apos;s connect.
              </p>
              <Link href={PRODUCT_ENGINEER_CTA.primary.href}>
                <LandingButton variant="primary" size="lg" className="gap-2">
                  {PRODUCT_ENGINEER_CTA.primary.text}
                  <ArrowRight className="h-4 w-4" />
                </LandingButton>
              </Link>
            </div>
          </BlurFade>
        </div>
      </main>

      <Footer />
    </LandingBackground>
  );
}
