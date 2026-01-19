"use client";

import { useState, useEffect, useCallback } from "react";
import { Palette, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeader } from "@/components/ui/section-header";
import { DesignSystemCard, type DesignSystemCardData } from "@/components/design-system-card";
import { cn } from "@/lib/utils";

const SECTION_MAX_WIDTH = "max-w-4xl";

export function DesignSystemsSection() {
  const [projects, setProjects] = useState<DesignSystemCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(projects.length - 1, prev + 1));
  }, [projects.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Don't render section if no design systems to show
  if (!loading && projects.length === 0) {
    return null;
  }

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < projects.length - 1;

  return (
    <section className="relative px-6 py-16">
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
          <>
            {/* Desktop: Grid Layout */}
            <BlurFade delay={0.2} inView className="hidden md:block">
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

            {/* Mobile: Carousel */}
            <BlurFade delay={0.2} inView className="md:hidden">
              <div className="relative">
                {/* Carousel track with padding for shadows */}
                <div className="py-2">
                  <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {projects.map((project, idx) => (
                      <div
                        key={project.id}
                        className="w-full flex-shrink-0"
                      >
                        <DesignSystemCard
                          project={project}
                          priority={idx < 2}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows */}
                {projects.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      disabled={!canGoPrevious}
                      className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10",
                        "h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm border border-border",
                        "flex items-center justify-center shadow-lg",
                        "transition-all duration-200",
                        canGoPrevious
                          ? "hover:bg-background hover:border-emerald-500/50 cursor-pointer"
                          : "opacity-30 cursor-not-allowed"
                      )}
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={goToNext}
                      disabled={!canGoNext}
                      className={cn(
                        "absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10",
                        "h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm border border-border",
                        "flex items-center justify-center shadow-lg",
                        "transition-all duration-200",
                        canGoNext
                          ? "hover:bg-background hover:border-emerald-500/50 cursor-pointer"
                          : "opacity-30 cursor-not-allowed"
                      )}
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                {/* Pagination Dots */}
                {projects.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {projects.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={cn(
                          "h-2 rounded-full transition-all duration-200",
                          currentIndex === idx
                            ? "w-6 bg-emerald-500"
                            : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </BlurFade>
          </>
        )}
      </div>
    </section>
  );
}
