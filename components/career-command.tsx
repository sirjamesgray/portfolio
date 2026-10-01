"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const CareerPalette = dynamic(
  () => import("@/components/career-palette").then((mod) => mod.CareerPalette),
  { ssr: false }
);

const SECTIONS = ["work", "turbo", "lab", "experience", "contact"];

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
  const { resolvedTheme, setTheme } = useTheme();

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

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) setSection(visible.target.id);
      },
      { rootMargin: "-40% 0px -45% 0px" }
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
                <span className="truncate">{section}</span>
                <button
                  type="button"
                  className="text-foreground"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                >
                  {resolvedTheme === "dark" ? "dark" : "light"}
                </button>
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
