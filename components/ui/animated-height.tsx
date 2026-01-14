"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedHeightProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedHeight({ children, className }: AnimatedHeightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a ResizeObserver to track height changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        setHeight(newHeight);
      }
    });

    resizeObserver.observe(containerRef.current);

    // Initial measurement
    setHeight(containerRef.current.offsetHeight);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      animate={{ height: height === "auto" ? "auto" : height }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
}
