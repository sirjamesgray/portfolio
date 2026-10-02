"use client";

import { useEffect, useState } from "react";
import { RESUME_PATH } from "@/lib/constants";
import styles from "./career-landing.module.css";

const SESSION_KEY = "career-intro-seen";
const NAME = "Jamie Gray";

const BOOT_LINES = [
  "$ whoami",
  "jamie gray: full stack developer (prev. product designer)",
  "$ ls ./shipped",
  "wewrite  lucent-wash  turbo/",
];

function motionOff() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** One plain name. No second outline and no scramble. */
export function ScrambleName({ className }: { className?: string }) {
  return <h1 className={className}>{NAME}</h1>;
}

function lineSlice(index: number, revealed: number) {
  let rest = revealed;
  for (let i = 0; i < index; i += 1) rest -= BOOT_LINES[i].length;
  if (rest <= 0) return "";
  return BOOT_LINES[index].slice(0, rest);
}

/** Boot lines are in the HTML. Typing starts only after paint. */
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
