"use client";

import { useState, useEffect } from "react";
import { Palette, Loader2 } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionCopyLink } from "@/components/ui/section-copy-link";
import { DesignSystemCard, type DesignSystemCardData } from "@/components/design-system-card";

const SECTION_MAX_WIDTH = "max-w-4xl";

export function DesignSystemsSection() {
  const [projects, setProjects] = useState<DesignSystemCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDesignSystems() {
      try {
        const response = await fetch("/api/projects/design-systems");
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Failed to fetch design systems:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDesignSystems();
  }, []);

  // Don't render section if no design systems to show
  if (!loading && projects.length === 0) {
    return null;
  }

  return (
    <section id="design-systems" className="group relative px-6 py-16 scroll-mt-20">
      <SectionCopyLink sectionId="design-systems" className="absolute top-4 right-4" />
      <div className={`mx-auto ${SECTION_MAX_WIDTH}`}>
        <BlurFade delay={0.1} inView>
          <SectionHeader
            icon={Palette}
            iconVariant="emerald"
            title="Design Systems I've Built"
            subtitle="Live examples of design systems I've created and maintain."
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
                <DesignSystemCard
                  key={project.id}
                  project={project}
                  priority={idx < 2}
                />
              ))}
            </div>
          </BlurFade>
        )}
      </div>
    </section>
  );
}
