"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, ArrowRight } from "lucide-react";
import { CursorGlow, GLOW_COLORS } from "@/components/ui/cursor-glow";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";
import { formatProjectType } from "@/lib/constants";
import { CARD_GLASS, CARD_INTERACTIVE_SOLID } from "@/lib/cards";

type FeaturedProject = {
  id: string;
  title: string | null;
  public_title: string | null;
  public_description: string | null;
  public_hero_image: string | null;
  public_industry: string | null;
  project_type: string | null;
  vercel_url: string | null;
  icon_url: string | null;
};

// Color palette for project cards
const COLORS = [
  "from-amber-500/20 via-orange-500/10 to-transparent",
  "from-cyan-500/20 via-blue-500/10 to-transparent",
  "from-purple-500/20 via-pink-500/10 to-transparent",
  "from-emerald-500/20 via-green-500/10 to-transparent",
  "from-rose-500/20 via-red-500/10 to-transparent",
];

// Matching glow colors for CursorGlow
const GLOW_COLOR_PALETTE = [
  GLOW_COLORS.amber,
  GLOW_COLORS.cyan,
  GLOW_COLORS.purple,
  GLOW_COLORS.emerald,
  GLOW_COLORS.rose,
];

export function ProjectsShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects/featured");
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Failed to fetch featured projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Don't render section if no featured projects
  if (!loading && projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <BlurFade delay={0.1} inView>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Recent Projects
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Landing pages and admin dashboards built for small businesses.
            </p>
          </div>
        </BlurFade>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1].map((idx) => (
              <div
                key={idx}
                className={`${CARD_GLASS.full} p-4 animate-pulse`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-5 w-32 rounded bg-white/10" />
                    <div className="h-3 w-20 rounded bg-white/10" />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 w-full rounded bg-white/10" />
                  <div className="h-3 w-4/5 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, idx) => {
              const displayTitle = project.public_title || project.title || "Untitled Project";
              const displayDescription = project.public_description || "Custom software solution built for small business needs.";
              const displayIndustry = project.public_industry || formatProjectType(project.project_type);
              const color = COLORS[idx % COLORS.length];
              const glowColor = GLOW_COLOR_PALETTE[idx % GLOW_COLOR_PALETTE.length];

              return (
                <BlurFade key={project.id} delay={0.15 + idx * 0.1} inView>
                  <Link href={`/projects/${project.id}`}>
                    <CursorGlow color={glowColor}>
                      <div
                        className={cn(
                          `group relative p-4 overflow-hidden h-full ${CARD_INTERACTIVE_SOLID.base} ${CARD_INTERACTIVE_SOLID.shadow}`,
                          hoveredIndex === idx
                            ? "border-primary/50 bg-primary/5 shadow-[var(--shadow-elevation-md)]"
                            : ""
                        )}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {/* Background gradient */}
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-300",
                          color,
                          hoveredIndex === idx ? "opacity-70" : "opacity-30"
                        )} />

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
                                loading={idx < 2 ? "eager" : "lazy"}
                              />
                            </div>
                          )}

                          {/* Content row: Logo | Text | Arrow */}
                          <div className="flex items-center gap-4">
                            {/* Logo */}
                            <div className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 overflow-hidden",
                              hoveredIndex === idx
                                ? "bg-primary/20 text-primary"
                                : "bg-white/10 text-muted-foreground"
                            )}>
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
                            <ArrowRight className={cn(
                              "h-5 w-5 shrink-0 transition-all duration-300",
                              hoveredIndex === idx
                                ? "text-primary translate-x-1"
                                : "text-muted-foreground"
                            )} />
                          </div>
                        </div>
                      </div>
                    </CursorGlow>
                  </Link>
                </BlurFade>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
