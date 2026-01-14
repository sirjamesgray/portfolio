"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, ArrowRight, ArrowLeft } from "lucide-react";
import { LandingButton } from "@/components/ui/landing-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { LandingBackground } from "@/components/landing-background";
import { ProjectCard, ProjectCardData } from "@/components/project-card";
import { formatProjectType } from "@/lib/constants";
import { CARD_GLASS, CARD_INTERACTIVE_SOLID } from "@/lib/cards";

export default function ProjectsPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
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
      <SiteHeader />

      <main className="flex-1 pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-6">
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

                return (
                  <BlurFade key={project.id} delay={0.1 + idx * 0.05}>
                    <Link href={`/projects/${project.id}`}>
                      <ProjectCard
                        project={project}
                        displayTitle={displayTitle}
                        displayDescription={displayDescription}
                        displayIndustry={displayIndustry}
                        isHovered={hoveredIndex === idx}
                        onHover={(hovered) => setHoveredIndex(hovered ? idx : null)}
                        priority={idx < 3}
                      />
                    </Link>
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
