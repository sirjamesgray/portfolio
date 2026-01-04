"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Glow } from "@codaworks/react-glow";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

// Get current month and year for dynamic end date
const getCurrentDate = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
};

const experience = [
  {
    company: "WeWrite",
    role: "Product Engineer",
    location: "DFW",
    startDate: "May 2025",
    endDate: getCurrentDate(),
  },
  {
    company: "Turbo",
    role: "Product Designer",
    location: "NYC",
    startDate: "Jun 2024",
    endDate: "May 2025",
  },
  {
    company: "Ramp",
    role: "Product Designer",
    location: "NYC",
    startDate: "Aug 2024",
    endDate: "Mar 2025",
  },
  {
    company: "Vondy",
    role: "Product Designer",
    location: "NYC",
    startDate: "Feb 2025",
    endDate: "Apr 2025",
  },
  {
    company: "Whop",
    role: "Product Designer",
    location: "NYC",
    startDate: "Jul 2023",
    endDate: "May 2024",
  },
  {
    company: "Saturday App",
    role: "Product Designer",
    location: "NYC",
    startDate: "Jan 2023",
    endDate: "Mar 2023",
  },
];

export function ExperienceTimeline() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="experience" className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <BlurFade delay={0.1} inView>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Experience
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
            {experience.map((job, idx) => (
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
                        <Glow color="hsl(270, 80%, 60%)">
                          <div
                            className={cn(
                              "w-full max-w-sm rounded-xl border p-4 transition-all duration-300 cursor-default backdrop-blur-xl glow:ring-1 glow:ring-purple-500/30 glow:border-purple-500/40",
                              hoveredIndex === idx
                                ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                                : "border-white/10 bg-card/40"
                            )}
                          >
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {job.company}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {job.role}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{job.location}</span>
                            </div>
                          </div>
                        </Glow>
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
                            ? "bg-primary text-primary-foreground scale-105"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {job.startDate}
                      </span>

                      {/* Start dot */}
                      <div
                        className={cn(
                          "mt-2 h-3 w-3 rounded-full transition-all duration-300 z-10",
                          hoveredIndex === idx
                            ? "bg-primary scale-125 shadow-lg shadow-primary/50"
                            : "bg-border"
                        )}
                      />

                      {/* Connecting vertical line */}
                      <div
                        className={cn(
                          "w-0.5 flex-1 min-h-12 transition-all duration-300",
                          hoveredIndex === idx
                            ? "bg-primary shadow-[0_0_8px_2px] shadow-primary/40"
                            : "bg-border"
                        )}
                      />

                      {/* End dot */}
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full transition-all duration-300 z-10",
                          hoveredIndex === idx
                            ? "bg-primary scale-125 shadow-lg shadow-primary/50"
                            : "bg-border"
                        )}
                      />

                      {/* End date */}
                      <span
                        className={cn(
                          "mt-2 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 whitespace-nowrap",
                          hoveredIndex === idx
                            ? "bg-primary text-primary-foreground scale-105"
                            : "bg-muted text-muted-foreground"
                        )}
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
                        <Glow color="hsl(270, 80%, 60%)">
                          <div
                            className={cn(
                              "w-full max-w-sm rounded-xl border p-4 transition-all duration-300 cursor-default backdrop-blur-xl glow:ring-1 glow:ring-purple-500/30 glow:border-purple-500/40",
                              hoveredIndex === idx
                                ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                                : "border-white/10 bg-card/40"
                            )}
                          >
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {job.company}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {job.role}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{job.location}</span>
                            </div>
                          </div>
                        </Glow>
                      ) : (
                        <div className="w-full max-w-sm" />
                      )}
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden py-2">
                    <Glow color="hsl(270, 80%, 60%)">
                      <div
                        className={cn(
                          "rounded-xl border p-4 transition-all duration-300 cursor-default backdrop-blur-xl glow:ring-1 glow:ring-purple-500/30 glow:border-purple-500/40",
                          hoveredIndex === idx
                            ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                            : "border-white/10 bg-card/40"
                        )}
                      >
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {job.company}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {job.role}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="rounded bg-muted px-2 py-0.5">{job.startDate}</span>
                          <div className="h-px flex-1 bg-border" />
                          <span className="rounded bg-muted px-2 py-0.5">{job.endDate}</span>
                        </div>
                      </div>
                    </Glow>
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
