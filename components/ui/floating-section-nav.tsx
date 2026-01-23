"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  id: string;
  label: string;
}

interface FloatingSectionNavProps {
  sections: SectionNavItem[];
  className?: string;
}

export function FloatingSectionNav({ sections, className }: FloatingSectionNavProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Auto-center the active section button
  const centerActiveSection = useCallback((sectionId: string) => {
    const container = scrollContainerRef.current;
    const button = buttonRefs.current.get(sectionId);

    if (container && button) {
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
    }
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id);
                // Center the active section button
                centerActiveSection(id);
              }
            });
          },
          { rootMargin: "-20% 0px -70% 0px" }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections, centerActiveSection]);

  const scrollToSection = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const setButtonRef = (id: string) => (el: HTMLButtonElement | null) => {
    if (el) {
      buttonRefs.current.set(id, el);
    } else {
      buttonRefs.current.delete(id);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className={cn("overflow-x-auto scrollbar-hide rounded-2xl", className)}
    >
      <div className="flex gap-2 px-1">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            ref={setButtonRef(id)}
            onClick={() => scrollToSection(id)}
            className={cn(
              "shrink-0 px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap",
              activeSection === id
                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium"
                : "text-foreground/60 hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
