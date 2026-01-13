"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, ArrowRight } from "lucide-react";
import { LandingButton } from "@/components/ui/landing-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { LandingBackground } from "@/components/landing-background";
import { CursorGlow } from "@/components/ui/cursor-glow";
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

export default function ProjectsPage() {
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
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <LandingBackground className="flex flex-col">
      <SiteHeader variant="back" backHref="/" backLabel="Home" />

      <main className="flex-1 pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <BlurFade delay={0.1}>
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Projects
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Landing pages and admin dashboards built for small businesses.
              </p>
            </div>
          </BlurFade>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`${CARD_GLASS.full} p-4 animate-pulse`}
                >
                  <div className="h-40 rounded-lg bg-white/10 mb-4" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10" />
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-32 rounded bg-white/10" />
                      <div className="h-3 w-20 rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <BlurFade delay={0.2}>
              <div className="text-center py-16">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No public projects available yet.
                </p>
              </div>
            </BlurFade>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, idx) => {
                const displayTitle = project.public_title || project.title || "Untitled Project";
                const displayDescription = project.public_description || "Custom software solution built for small business needs.";
                const displayIndustry = project.public_industry || formatProjectType(project.project_type);
                const color = COLORS[idx % COLORS.length];

                return (
                  <BlurFade key={project.id} delay={0.1 + idx * 0.05}>
                    <CursorGlow>
                      <Link href={`/projects/${project.id}`}>
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
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading={idx < 3 ? "eager" : "lazy"}
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
                      </Link>
                    </CursorGlow>
                  </BlurFade>
                );
              })}
            </div>
          )}

          {/* CTA Card */}
          <BlurFade delay={0.3}>
            <div className={`${CARD_INTERACTIVE_SOLID.full} mt-16 p-8 text-center`}>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Need your own website?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                I build custom websites for small businesses. Let&apos;s chat about what you need.
              </p>
              <Link href="/contact">
                <LandingButton variant="primary" size="lg" className="gap-2">
                  Get in touch
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
