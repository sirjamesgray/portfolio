"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Rocket, Loader2 } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionCopyLink } from "@/components/ui/section-copy-link";
import { ProjectCard, type ProjectCardData } from "@/components/project-card";

const SECTION_MAX_WIDTH = "max-w-4xl";

export function ProjectsSection() {
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

  if (!loading && projects.length === 0) return null;

  return (
    <section id="projects" className="group relative px-6 py-16 scroll-mt-20">
      <SectionCopyLink sectionId="projects" className="absolute top-4 right-4" />
      <div className={`mx-auto ${SECTION_MAX_WIDTH}`}>
        <BlurFade delay={0.1} inView>
          <SectionHeader
            icon={Rocket}
            iconVariant="emerald"
            title="Projects I've Built"
            subtitle="Live projects on the internet - click to read the full story."
          />
        </BlurFade>

        {loading ? (
          <BlurFade delay={0.2} inView>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </BlurFade>
        ) : (
          <BlurFade delay={0.2} inView>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project, idx) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <ProjectCard
                    project={project}
                    displayTitle={project.public_title || project.title || "Untitled"}
                    displayDescription={project.public_description || ""}
                    displayIndustry={project.public_industry || "Project"}
                    variant="simple"
                    priority={idx < 2}
                  />
                </Link>
              ))}
            </div>
          </BlurFade>
        )}
      </div>
    </section>
  );
}
