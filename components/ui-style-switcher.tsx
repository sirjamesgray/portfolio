"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SHOWCASE_STYLES, type ShowcaseStyle } from "@/components/ui-showcase";
import { cn } from "@/lib/utils";

const STYLE_LABELS: Record<ShowcaseStyle, string> = {
  paper: "Paper",
  neon: "Neon",
  leather: "Leather",
  blueprint: "Blueprint",
  neumorphism: "Neumorphism",
  glassmorphism: "Glassmorphism",
  pixel: "Pixel",
};

const CYCLE_DURATION = 5000; // 5 seconds per style

interface UIStyleSwitcherProps {
  activeStyle: ShowcaseStyle;
  onStyleChange: (style: ShowcaseStyle) => void;
}

export function UIStyleSwitcher({ activeStyle, onStyleChange }: UIStyleSwitcherProps) {
  const styleNames = Object.keys(SHOWCASE_STYLES) as ShowcaseStyle[];
  const lastInteractionRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<ShowcaseStyle, HTMLButtonElement>>(new Map());

  // Scroll active button into view
  const scrollToActive = useCallback((styleName: ShowcaseStyle) => {
    const container = containerRef.current;
    const button = buttonRefs.current.get(styleName);
    if (!container || !button) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    // Calculate the scroll position to center the button
    const buttonCenter = buttonRect.left + buttonRect.width / 2;
    const containerCenter = containerRect.left + containerRect.width / 2;
    const scrollOffset = buttonCenter - containerCenter;

    container.scrollBy({
      left: scrollOffset,
      behavior: "smooth",
    });
  }, []);

  // Navigate to previous/next style (with looping)
  const navigateStyle = useCallback((direction: "prev" | "next") => {
    lastInteractionRef.current = Date.now();
    const currentIndex = styleNames.indexOf(activeStyle);
    const newIndex = direction === "prev"
      ? (currentIndex - 1 + styleNames.length) % styleNames.length
      : (currentIndex + 1) % styleNames.length;
    onStyleChange(styleNames[newIndex]);
  }, [activeStyle, onStyleChange, styleNames]);

  // Auto-cycle through styles
  useEffect(() => {
    const interval = setInterval(() => {
      // Don't auto-advance if user recently interacted
      if (Date.now() - lastInteractionRef.current < CYCLE_DURATION) {
        return;
      }

      const currentIndex = styleNames.indexOf(activeStyle);
      const nextIndex = (currentIndex + 1) % styleNames.length;
      onStyleChange(styleNames[nextIndex]);
    }, CYCLE_DURATION);

    return () => clearInterval(interval);
  }, [activeStyle, onStyleChange, styleNames]);

  // Scroll to active style when it changes
  useEffect(() => {
    scrollToActive(activeStyle);
  }, [activeStyle, scrollToActive]);

  const handleClick = (styleName: ShowcaseStyle) => {
    lastInteractionRef.current = Date.now();
    onStyleChange(styleName);
  };

  return (
    <div className="relative flex items-center justify-center gap-2 w-full max-w-md mx-auto px-2">
      {/* Left chevron - always visible, navigates to previous style */}
      <button
        onClick={() => navigateStyle("prev")}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-muted transition-colors z-10"
        aria-label="Previous style"
      >
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="flex-1 min-w-0 flex justify-start sm:justify-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {styleNames.map((styleName) => {
          const isActive = activeStyle === styleName;

          return (
            <button
              key={styleName}
              ref={(el) => {
                if (el) buttonRefs.current.set(styleName, el);
              }}
              onClick={() => handleClick(styleName)}
              className={cn(
                "relative px-3 py-1.5 text-sm rounded-full transition-colors overflow-hidden shrink-0",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {isActive && (
                <>
                  <motion.span
                    layoutId="activeShowcaseStyle"
                    className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                  {/* Progress bar that fills from left to right */}
                  <motion.span
                    key={`progress-${styleName}-${activeStyle}`}
                    className="absolute bottom-0 left-0 h-[2px] bg-emerald-500/50 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: CYCLE_DURATION / 1000, ease: "linear" }}
                  />
                </>
              )}
              <span className="relative z-10">{STYLE_LABELS[styleName]}</span>
            </button>
          );
        })}
      </div>

      {/* Right chevron - always visible, navigates to next style */}
      <button
        onClick={() => navigateStyle("next")}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-muted transition-colors z-10"
        aria-label="Next style"
      >
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}
