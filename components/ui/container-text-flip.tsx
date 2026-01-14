"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const ContainerTextFlip = ({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
}: {
  words?: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
  animationDuration?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [width, setWidth] = useState<number | "auto">("auto");
  const measureRef = useRef<HTMLSpanElement>(null);

  // Ensure we only animate on client to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Measure the width of the current word
  const measureWidth = useCallback(() => {
    if (measureRef.current) {
      const measured = measureRef.current.offsetWidth;
      setWidth(measured);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      // Small delay to ensure font is loaded and rendered
      requestAnimationFrame(measureWidth);
    }
  }, [isClient, currentIndex, measureWidth]);

  useEffect(() => {
    if (!isClient) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isClient, interval, words.length]);

  const currentWord = words[currentIndex];

  // Spring animation config for bouncy effect
  const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
  };

  // Server-side and initial client render: show first word without animation
  if (!isClient) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-lg bg-card border border-border shadow-sm dark:bg-emerald-500/20 dark:border-emerald-500/30 px-2 py-1",
          className
        )}
      >
        <span className={cn("text-emerald-600 dark:text-emerald-400", textClassName)}>
          {words[0]}
        </span>
      </span>
    );
  }

  return (
    <motion.span
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-card border border-border shadow-sm dark:bg-emerald-500/20 dark:border-emerald-500/30 overflow-hidden",
        className
      )}
      animate={{ width: width !== "auto" ? width + 16 : "auto" }} // +16 for px-2 padding
      transition={springTransition}
    >
      <span className="relative inline-flex items-center justify-center px-2 py-1">
        {/* Hidden span to measure width */}
        <span
          ref={measureRef}
          className={cn("invisible absolute whitespace-nowrap", textClassName)}
          aria-hidden="true"
        >
          {currentWord}
        </span>

        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentWord}
            className={cn(
              "text-emerald-600 dark:text-emerald-400 whitespace-nowrap",
              textClassName
            )}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.9 }}
            transition={{
              opacity: { duration: 0.1 },
              y: { type: "spring", stiffness: 500, damping: 25 },
              scale: { type: "spring", stiffness: 500, damping: 25 },
            }}
          >
            {currentWord}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.span>
  );
};
