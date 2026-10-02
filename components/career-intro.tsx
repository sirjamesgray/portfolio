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
  const [phase, setPhase] = useState<"pending" | "type" | "done">("pending");
  const [revealed, setRevealed] = useState(0);
  const [command, setCommand] = useState("");
  const [focused, setFocused] = useState(false);
  const showResume = command.trim() === "resume";
  const promptOpen = focused || command.length > 0;

  useEffect(() => {
    if (motionOff() || sessionStorage.getItem(SESSION_KEY) === "1") {
      setPhase("done");
      return;
    }
    const total = BOOT_LINES.reduce((sum, line) => sum + line.length, 0);
    let count = 0;
    setPhase("type");
    const timer = window.setInterval(() => {
      count += 2;
      if (count >= total) {
        window.clearInterval(timer);
        sessionStorage.setItem(SESSION_KEY, "1");
        setPhase("done");
        return;
      }
      setRevealed(count);
    }, 18);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className={`${styles.terminal} mt-2 max-w-full overflow-hidden border sm:mt-4`}
      data-boot={phase === "done" ? "done" : "run"}
    >
      <p className="border-b border-border px-3 py-1 font-mono text-[10px] text-[#b4b4b4]">terminal</p>
      <pre className={`${styles.phosphor} max-w-full overflow-x-hidden px-3 py-1.5 font-mono text-[11px] leading-snug sm:py-2 sm:leading-relaxed`}>
        {BOOT_LINES.map((line, index) => {
          const text = phase === "type" ? lineSlice(index, revealed) : line;
          if (!text) return null;
          return (
            <span key={line} className={styles.typeLine}>
              {text}
            </span>
          );
        })}
      </pre>
      <form
        className={
          promptOpen
            ? "flex items-center gap-2 border-t border-border px-3 py-1.5 font-mono text-[11px]"
            : styles.promptIdle
        }
        onSubmit={(event) => event.preventDefault()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {promptOpen ? <span className="text-foreground">$</span> : null}
        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          aria-label="Terminal"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={`${styles.phosphor} min-w-0 flex-1 bg-transparent outline-none`}
        />
        {promptOpen ? <span className={styles.caret} aria-hidden /> : null}
      </form>
      {showResume ? (
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
