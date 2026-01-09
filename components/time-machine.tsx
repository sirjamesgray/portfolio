"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";
import { EXPERIENCE } from "@/lib/constants";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
}

// Generate stars (called only on client to avoid hydration mismatch)
function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.7 + 0.3,
    twinkleDelay: Math.random() * 3,
  }));
}

export function TimeMachine() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Generate stars only on client side to avoid hydration mismatch
  useEffect(() => {
    setStars(generateStars(100));
  }, []);

  // Handle scroll wheel to navigate through cards
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInView && rect.top <= 100 && rect.bottom >= window.innerHeight - 100) {
      e.preventDefault();

      if (e.deltaY > 0 && selectedIndex < EXPERIENCE.length - 1) {
        setSelectedIndex((prev) => Math.min(prev + 1, EXPERIENCE.length - 1));
      } else if (e.deltaY < 0 && selectedIndex > 0) {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Calculate 3D transform for each card
  const getCardStyle = (index: number) => {
    const diff = index - selectedIndex;
    const absBase = Math.abs(diff);

    if (diff < 0) {
      // Cards in the past (behind) - recede into the distance
      return {
        zIndex: EXPERIENCE.length - absBase,
        transform: `
          translateZ(${diff * 80}px)
          translateY(${diff * 15}px)
          scale(${1 - absBase * 0.08})
        `,
        opacity: Math.max(0, 1 - absBase * 0.25),
        filter: `blur(${absBase * 0.5}px)`,
      };
    } else if (diff > 0) {
      // Future cards (below) - hidden
      return {
        zIndex: 0,
        transform: `translateY(100px) scale(0.9)`,
        opacity: 0,
        filter: "blur(4px)",
      };
    }
    // Current card
    return {
      zIndex: EXPERIENCE.length + 1,
      transform: "translateZ(0) translateY(0) scale(1)",
      opacity: 1,
      filter: "blur(0px)",
    };
  };

  return (
    <section id="experience" className="relative">
      <BlurFade delay={0.1} inView>
        <div className="px-6 py-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Experience
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            8 years of designing and building products at high-growth startups.
          </p>
        </div>
      </BlurFade>

      {/* Time Machine Container */}
      <div
        ref={containerRef}
        className="relative h-[600px] overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        {/* Space Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/30 to-slate-950">
          {/* Stars - rendered only on client */}
          <svg className="absolute inset-0 w-full h-full">
            {stars.map((star) => (
              <circle
                key={star.id}
                cx={`${star.x}%`}
                cy={`${star.y}%`}
                r={star.size}
                fill="white"
                className="animate-pulse"
                style={{
                  opacity: star.opacity,
                  animationDelay: `${star.twinkleDelay}s`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </svg>

          {/* Galaxy/Nebula gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />

          {/* Vignette effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]" />
        </div>

        {/* Stacked Cards Container */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="relative w-full max-w-lg px-6" style={{ transformStyle: "preserve-3d" }}>
            {EXPERIENCE.map((job, idx) => {
              const style = getCardStyle(idx);
              return (
                <motion.div
                  key={job.company}
                  className="absolute left-0 right-0 mx-6 cursor-pointer"
                  style={{
                    zIndex: style.zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  animate={{
                    transform: style.transform,
                    opacity: style.opacity,
                    filter: style.filter,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  onClick={() => setSelectedIndex(idx)}
                >
                  {/* macOS-style window */}
                  <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                    {/* Window title bar */}
                    <div className="bg-gradient-to-b from-gray-700 to-gray-800 px-4 py-2 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <span className="flex-1 text-center text-xs text-gray-400 font-medium">
                        {job.company}
                      </span>
                    </div>

                    {/* Window content */}
                    <div className="bg-gray-900/95 backdrop-blur-xl p-6">
                      <div className="flex items-start gap-4">
                        {job.logo && (
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/10 shadow-lg">
                            <Image
                              src={job.logo}
                              alt={`${job.company} logo`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {job.company}
                          </h3>
                          <p className="text-emerald-300 font-medium">
                            {job.role}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                              {job.startDate}
                            </span>
                            <span className="text-gray-500">→</span>
                            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                              {job.endDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Timeline Scrubber (Right Side) */}
        <div
          ref={timelineRef}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-end gap-0 z-50"
        >
          {/* Timeline track */}
          <div className="absolute right-[5px] top-0 bottom-0 w-[2px] bg-white/20 rounded-full" />

          {EXPERIENCE.map((job, idx) => {
            const isSelected = idx === selectedIndex;
            const isPast = idx < selectedIndex;

            return (
              <button
                key={job.company}
                onClick={() => setSelectedIndex(idx)}
                className="relative flex items-center gap-2 py-3 group"
              >
                {/* Date label */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="text-xs font-medium text-white whitespace-nowrap mr-2"
                    >
                      {job.endDate}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tick mark */}
                <div
                  className={cn(
                    "relative z-10 transition-all duration-300",
                    isSelected
                      ? "w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"
                      : isPast
                      ? "w-2 h-2 rounded-full bg-white/60"
                      : "w-1.5 h-[2px] bg-white/30 group-hover:bg-white/60"
                  )}
                />

                {/* Hover tooltip */}
                <div
                  className={cn(
                    "absolute right-8 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-black/80 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                    isSelected && "hidden"
                  )}
                >
                  {job.company}
                </div>
              </button>
            );
          })}
        </div>

        {/* Current date indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white"
            >
              <span className="text-2xl font-bold">{EXPERIENCE[selectedIndex].endDate}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation hint */}
        <div className="absolute bottom-6 right-6 text-xs text-white/40 z-50">
          Scroll to navigate
        </div>
      </div>

      {/* Mobile fallback - simpler layout */}
      <div className="md:hidden px-6 py-6">
        <div className="space-y-4">
          {EXPERIENCE.map((job, idx) => (
            <BlurFade key={job.company} delay={0.1 + idx * 0.05} inView>
              <div
                className={cn(
                  "rounded-xl border p-4 transition-all duration-300 backdrop-blur-xl",
                  selectedIndex === idx
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : "border-white/10 bg-card/40"
                )}
                onClick={() => setSelectedIndex(idx)}
              >
                <div className="flex items-start gap-3">
                  {job.logo && (
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
                      <Image
                        src={job.logo}
                        alt={`${job.company} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{job.company}</h3>
                    <p className="text-sm text-muted-foreground">{job.role}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-2 py-0.5">{job.startDate}</span>
                  <div className="h-px flex-1 bg-border" />
                  <span className="rounded bg-muted px-2 py-0.5">{job.endDate}</span>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
