"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CareerPalette = dynamic(
  () => import("@/components/career-palette").then((mod) => mod.CareerPalette),
  { ssr: false }
);

/** Opens the command palette. The hint button is in the first HTML paint. */
export function CareerCommand() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        setLoaded(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        className="shrink-0 rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground"
      >
        ⌘K
        <span className="sr-only">Open the command palette</span>
      </button>
      {loaded ? <CareerPalette open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
