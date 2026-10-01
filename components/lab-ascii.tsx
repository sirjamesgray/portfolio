"use client";

import { useEffect, useRef } from "react";

const GLYPHS = " .:-=+*#";

/**
 * A quiet ASCII field. The loop stops off screen and when the tab is hidden.
 */
export function LabAscii() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5 };
    let raf = 0;
    let running = false;

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / Math.max(1, rect.width);
      pointer.y = (event.clientY - rect.top) / Math.max(1, rect.height);
    };
    canvas.addEventListener("pointermove", onPointer);

    const fit = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillStyle = getComputedStyle(canvas).color;
      const cols = Math.max(1, Math.floor(width / 9));
      const rows = Math.max(1, Math.floor(height / 13));
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const dx = x / cols - pointer.x;
          const dy = y / rows - pointer.y;
          const ripple = Math.sin(Math.hypot(dx, dy) * 18 - time * 0.004);
          const wave = Math.sin(x * 0.32 + time * 0.0016) + ripple;
          const index = Math.max(0, Math.min(GLYPHS.length - 1, Math.floor(((wave + 2) / 4) * (GLYPHS.length - 1))));
          ctx.fillText(GLYPHS[index], x * 9, y * 13 + 11);
        }
      }
    };

    const frame = (now: number) => {
      if (!running) return;
      draw(now);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      fit();
      if (reduce) {
        draw(0);
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
        else stop();
      },
      { threshold: 0.15 }
    );
    observer.observe(canvas);

    const onHide = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onHide);

    return () => {
      stop();
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  return <canvas ref={ref} className="h-44 w-full text-foreground" aria-hidden />;
}
