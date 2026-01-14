"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
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

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [isClient, duration, words.length]);

  const currentWord = words[currentIndex];

  // Server-side and initial client render: show first word without animation
  if (!isClient) {
    return (
      <span className={cn("inline-block", className)}>
        {words[0]}
      </span>
    );
  }

  return (
    <motion.span
      className="inline-flex relative"
      animate={{ width }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Hidden span to measure width */}
      <span
        ref={measureRef}
        className={cn("invisible whitespace-nowrap", className)}
        aria-hidden="true"
      >
        {currentWord}
      </span>

      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          className={cn("absolute left-0 top-0", className)}
          initial={{ y: 8, filter: "blur(6px)" }}
          animate={{ y: 0, filter: "blur(0px)" }}
          exit={{ y: -12, filter: "blur(6px)" }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
};
