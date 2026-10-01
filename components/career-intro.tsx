"use client";

import { useEffect, useState } from "react";
import styles from "./career-landing.module.css";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SESSION_KEY = "career-intro-seen";

function motionOff() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The name is in the first HTML paint.
 * The scramble runs after paint, then stops.
 */
export function ScrambleName({ className }: { className?: string }) {
  const text = "Jamie Gray";
  const [value, setValue] = useState(text);
  const [done, setDone] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (motionOff() || sessionStorage.getItem(SESSION_KEY) === "1") return;

    const start = performance.now();
    const duration = 900;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(t * text.length);
      const next = text
        .split("")
        .map((char, index) => {
          if (char === " " || index < reveal) return text[index];
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setValue(next);
      setArmed(true);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      setValue(text);
      sessionStorage.setItem(SESSION_KEY, "1");
      setDone(true);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <h1 className={className}>{value}</h1>
      {armed && !done ? (
        <button
          type="button"
          className="mt-2 font-mono text-xs text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => {
            setValue(text);
            sessionStorage.setItem(SESSION_KEY, "1");
            setDone(true);
          }}
        >
          Skip intro
        </button>
      ) : null}
    </>
  );
}

/** Boot lines stay in the HTML. A caret moves across them once. */
export function BootSequence() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (motionOff() || sessionStorage.getItem(SESSION_KEY) === "1") return;
    const frame = requestAnimationFrame(() => setPlay(true));
    const timer = window.setTimeout(() => setPlay(false), 1600);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <pre
      className={`${styles.boot} ${play ? styles.bootPlay : ""} mt-4 max-w-md font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs`}
    >
      <span className="block text-foreground">$ whoami</span>
      <span className="block">jamie gray: product + design engineer</span>
    </pre>
  );
}
