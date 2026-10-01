"use client";

import { useEffect, useRef, useState } from "react";
import { RESUME_PATH } from "@/lib/constants";
import styles from "./career-landing.module.css";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SESSION_KEY = "career-intro-seen";
const NAME = "Jamie Gray";

const BOOT_LINES = [
  "$ whoami",
  "jamie gray: product + design engineer",
  "$ cat thesis.txt",
  "software that lets people earn from their own work",
  "$ ls ./shipped",
  "wewrite  lucent-wash  turbo/",
];

function motionOff() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The name stays in the first HTML paint.
 * The RGB split is a class on top of that text.
 */
export function ScrambleName({ className }: { className?: string }) {
  const [value, setValue] = useState(NAME);
  const [hot, setHot] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (motionOff()) return;

    let idle = 0;
    const armIdle = () => {
      const wait = 8000 + Math.random() * 4000;
      idle = window.setTimeout(() => {
        if (document.hidden) {
          armIdle();
          return;
        }
        setHot(true);
        window.setTimeout(() => setHot(false), 150);
        armIdle();
      }, wait);
    };

    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      armIdle();
      return () => window.clearTimeout(idle);
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      const reveal = Math.floor(t * NAME.length);
      setShowSkip(true);
      setHot(true);
      setValue(
        NAME.split("")
          .map((char, index) => {
            if (char === " " || index < reveal) return NAME[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      setValue(NAME);
      setHot(false);
      setShowSkip(false);
      sessionStorage.setItem(SESSION_KEY, "1");
      armIdle();
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
    };
  }, []);

  return (
    <>
      <h1
        data-text={NAME}
        className={`${className ?? ""} ${hot ? styles.rgb : ""}`}
        onMouseEnter={() => {
          if (motionOff()) return;
          setHot(true);
          window.setTimeout(() => setHot(false), 360);
        }}
      >
        {value}
      </h1>
      {showSkip ? (
        <button
          type="button"
          className="mt-2 font-mono text-xs text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => {
            setValue(NAME);
            setHot(false);
            setShowSkip(false);
            sessionStorage.setItem(SESSION_KEY, "1");
          }}
        >
          Skip intro
        </button>
      ) : null}
    </>
  );
}

function lineSlice(index: number, revealed: number) {
  let rest = revealed;
  for (let i = 0; i < index; i += 1) rest -= BOOT_LINES[i].length;
  if (rest <= 0) return "";
  return BOOT_LINES[index].slice(0, rest);
}

/** Boot lines are in the HTML. Typing starts only after paint. */
/** Grain and scanlines move only while the hero is on screen. */
export function HeroAtmosphere() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section || motionOff()) return;
    let seen = false;
    const apply = () => {
      section.toggleAttribute("data-live", seen && !document.hidden);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        seen = Boolean(entry?.isIntersecting);
        apply();
      },
      { threshold: 0.08 }
    );
    observer.observe(section);
    document.addEventListener("visibilitychange", apply);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", apply);
      section.removeAttribute("data-live");
    };
  }, []);

  return <div ref={ref} className={styles.grain} aria-hidden />;
}

export function BootSequence() {
  const [revealed, setRevealed] = useState<number | null>(null);
  const [command, setCommand] = useState("");
  const hired = command.trim() === "sudo hire";

  useEffect(() => {
    if (motionOff() || sessionStorage.getItem(SESSION_KEY) === "1") return;
    const total = BOOT_LINES.reduce((sum, line) => sum + line.length, 0);
    let count = 0;
    const timer = window.setInterval(() => {
      count += 2;
      if (count >= total) {
        window.clearInterval(timer);
        setRevealed(null);
        return;
      }
      setRevealed(count);
    }, 18);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={`${styles.terminal} mt-2 max-w-full overflow-hidden rounded-md border sm:mt-4`}>
      <p className="border-b border-border px-3 py-1 font-mono text-[10px] text-[#b4b4b4]">terminal</p>
      <pre className={`${styles.phosphor} max-w-full overflow-x-hidden px-3 py-1.5 font-mono text-[11px] leading-snug sm:py-2 sm:leading-relaxed`}>
        {BOOT_LINES.map((line, index) => {
          const text = revealed === null ? line : lineSlice(index, revealed);
          if (!text) return null;
          return (
            <span key={line} className={styles.typeLine}>
              {text}
            </span>
          );
        })}
      </pre>
      <form
        className="flex items-center gap-2 border-t border-border px-3 py-1.5 font-mono text-[11px]"
        onSubmit={(event) => event.preventDefault()}
      >
        <span className="text-foreground">$</span>
        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          aria-label="Terminal"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={`${styles.phosphor} min-w-0 flex-1 bg-transparent outline-none`}
        />
        <span className={styles.caret} aria-hidden />
      </form>
      {hired ? (
        <p className="border-t border-border px-3 py-2 font-mono text-[11px] text-foreground">
          The resume is here.{" "}
          <a href={RESUME_PATH} className="text-brand underline underline-offset-4">
            Download resume
          </a>
        </p>
      ) : null}
    </div>
  );
}
