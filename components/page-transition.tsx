"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __pageShown?: boolean;
  }
}

/**
 * Route transition. The first load is never animated, so LCP is not delayed.
 * Later client navigations fade and rise for 180ms with the Web Animations API.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.__pageShown) {
      window.__pageShown = true;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ref.current?.animate(
      [
        { opacity: 0, transform: "translateY(6px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 180, easing: "ease-out" }
    );
  }, []);

  return <div ref={ref}>{children}</div>;
}
