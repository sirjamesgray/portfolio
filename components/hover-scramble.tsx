"use client";

import { useState } from "react";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz";

/** Hover swaps letters, then returns the real heading. */
export function HoverScramble({ text }: { text: string }) {
  const [value, setValue] = useState(text);

  const scramble = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const timer = window.setInterval(() => {
      frame += 1;
      const reveal = Math.floor((frame / 8) * text.length);
      setValue(
        text
          .split("")
          .map((char, index) => {
            if (char === " " || index < reveal) return text[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      if (frame >= 8) {
        window.clearInterval(timer);
        setValue(text);
      }
    }, 36);
  };

  return (
    <span onMouseEnter={scramble} onFocus={scramble}>
      {value}
    </span>
  );
}
