"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { ProjectCard, ProjectCardData } from "@/components/project-card";
import { formatProjectType } from "@/lib/constants";
import { CARD_GLASS } from "@/lib/cards";

export function ProjectsShowcase() {
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

              return (
                <BlurFade key={project.id} delay={0.15 + idx * 0.1} inView>
                  <Link href={`/projects/${project.id}`}>
                    <ProjectCard
                      project={project}
                      displayTitle={displayTitle}
                      displayDescription={displayDescription}
                      displayIndustry={displayIndustry}
                      isHovered={hoveredIndex === idx}
                      onHover={(hovered) => setHoveredIndex(hovered ? idx : null)}
                      priority={idx < 2}
                    />
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
