"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const CareerPalette = dynamic(
  () => import("@/components/career-palette").then((mod) => mod.CareerPalette),
  { ssr: false }
);

const SECTIONS = ["work", "turbo", "lab", "experience", "contact"];

const SECTION_LABELS: Record<string, string> = {
  work: "Work",
  turbo: "Turbo",
  lab: "Lab",
  experience: "Experience",
  contact: "Contact",
};

function typingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

/** Command button, status bar, and keyboard jumps. */
export function CareerCommand() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [help, setHelp] = useState(false);
  const [section, setSection] = useState("work");
  const [ready, setReady] = useState(false);

  const showPalette = () => {
    setLoaded(true);
    setOpen(true);
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    let pending = false;
    let pendingTimer = 0;

    const jump = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        showPalette();
        return;
      }
      if (typingTarget(event.target)) return;
      if (event.key === "?") {
        event.preventDefault();
        setHelp(true);
        return;
      }
      if (event.key === "g" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        pending = true;
        window.clearTimeout(pendingTimer);
        pendingTimer = window.setTimeout(() => {
          pending = false;
        }, 800);
        return;
      }
      if (pending && event.key === "w") {
        pending = false;
        jump("work");
      }
      if (pending && event.key === "t") {
        pending = false;
        jump("turbo");
      }
    };

    const onHelp = () => setHelp(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("career-help", onHelp);

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!id) continue;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let bestId = "";
        let bestRatio = 0;
        for (const id of SECTIONS) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) setSection(bestId);
      },
      {
        rootMargin: "-35% 0px -40% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      }
    );
    SECTIONS.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(pendingTimer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("career-help", onHelp);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={showPalette}
        className="shrink-0 rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground"
      >
        ⌘K
        <span className="sr-only">Open the command palette</span>
      </button>
      {loaded ? <CareerPalette open={open} onOpenChange={setOpen} /> : null}
      {ready
        ? createPortal(
            <div
              className="hidden md:block"
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 30,
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              <div className="flex h-9 items-center justify-between gap-3 border-t border-border bg-background px-4 font-mono text-[11px] text-muted-foreground">
                <span className="truncate">career-landing</span>
                <button type="button" onClick={showPalette} className="text-foreground">
                  ⌘K
                </button>
                <span className="truncate text-brand">{SECTION_LABELS[section] ?? section}</span>
              </div>
            </div>,
            document.body
          )
        : null}
      <Dialog open={help} onOpenChange={setHelp}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Shortcuts</DialogTitle>
          <DialogDescription>Keys for this page.</DialogDescription>
          <ul className="space-y-2 font-mono text-sm text-foreground">
            <li>⌘K or Ctrl K · command palette</li>
            <li>? · this sheet</li>
            <li>g then w · Work</li>
            <li>g then t · Turbo</li>
            <li>terminal · sudo hire</li>
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
