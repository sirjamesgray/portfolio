"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./motion.module.css";

/**
 * Fade and rise once when the block scrolls into view.
 * Content already on screen at load stays visible, so first paint is never hidden.
 * Reduced motion skips the effect. Only opacity and transform change.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  ...rest
}: React.HTMLAttributes<HTMLElement> & {
  delay?: number;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight * 0.95) return;
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("shown");
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const cls = `${className} ${state === "hidden" ? styles.hidden : ""} ${state === "shown" ? styles.shown : ""}`;
  const style = state === "shown" && delay ? { transitionDelay: `${Math.min(delay, 300)}ms` } : undefined;
  const Component = Tag as "div";
  return (
    <Component ref={ref as React.RefObject<HTMLDivElement>} {...(rest as object)} className={cls} style={style}>
      {children}
    </Component>
  );
}
