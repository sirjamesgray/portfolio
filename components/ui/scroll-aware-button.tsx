"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LandingButton, type LandingButtonProps } from "@/components/ui/landing-button";
import { cn } from "@/lib/utils";

interface ScrollAwareButtonProps extends Omit<LandingButtonProps, "children" | "onClick"> {
  /** Text shown when at top of page */
  topText: string;
  /** Text shown when scrolled down */
  scrolledText: string;
  /** Scroll threshold in pixels to trigger the change (default: window.innerHeight * 0.5) */
  scrollThreshold?: number;
  /** Selector for the element to scroll to when at top (default: first section with scroll-mt-20) */
  scrollToSelector?: string;
  /** ID of the element to scroll to top (default: "top") */
  topId?: string;
}

/**
 * ScrollAwareButton - A button that transforms based on scroll position
 *
 * When at the top of the page, shows primary text with arrow-right icon and scrolls to content.
 * When scrolled down, transforms to secondary text with arrow-up icon and scrolls back to top.
 *
 * Features smooth direction-aware animated transitions using Framer Motion.
 * Animation direction matches scroll direction for a natural feel.
 *
 * @example
 * ```tsx
 * <ScrollAwareButton
 *   topText="Learn More"
 *   scrolledText="Back to Top"
 *   variant="secondary"
 * />
 * ```
 */
export function ScrollAwareButton({
  topText,
  scrolledText,
  scrollThreshold,
  scrollToSelector = "section[id].scroll-mt-20",
  topId = "top",
  className,
  ...buttonProps
}: ScrollAwareButtonProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  // Track scroll direction: 1 = scrolling down, -1 = scrolling up
  const [scrollDirection, setScrollDirection] = useState<1 | -1>(1);
  const lastScrollY = useRef(0);

  // Calculate default threshold based on viewport height
  const getThreshold = useCallback(() => {
    return scrollThreshold ?? (typeof window !== "undefined" ? window.innerHeight * 0.5 : 400);
  }, [scrollThreshold]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = getThreshold();

      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection(1); // Scrolling down
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection(-1); // Scrolling up
      }
      lastScrollY.current = currentScrollY;

      setIsScrolled(currentScrollY > threshold);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [getThreshold]);

  const handleClick = () => {
    if (isScrolled) {
      // Scroll to top
      const topElement = document.getElementById(topId);
      if (topElement) {
        topElement.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Scroll to first content section
      const sections = document.querySelectorAll(scrollToSelector);
      if (sections.length > 0) {
        sections[0].scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Animation easing
  const easing = [0.25, 0.46, 0.45, 0.94] as const;

  return (
    <LandingButton
      onClick={handleClick}
      className={cn("relative overflow-hidden", className)}
      {...buttonProps}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isScrolled ? (
          <motion.span
            key="scrolled"
            initial={{ opacity: 0, y: scrollDirection * 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.2, ease: easing }
            }}
            exit={{
              opacity: 0,
              y: scrollDirection * -12,
              transition: { duration: 0.15, ease: easing }
            }}
            className="flex items-center gap-2"
          >
            {scrolledText}
            <ArrowUp className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="top"
            initial={{ opacity: 0, y: scrollDirection * 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.2, ease: easing }
            }}
            exit={{
              opacity: 0,
              y: scrollDirection * -12,
              transition: { duration: 0.15, ease: easing }
            }}
            className="flex items-center gap-2"
          >
            {topText}
            <ArrowRight className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </LandingButton>
  );
}
