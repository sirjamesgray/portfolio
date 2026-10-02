"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Command } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CareerButton } from "@/components/career-button";

const CareerPalette = dynamic(
  () => import("@/components/career-palette").then((mod) => mod.CareerPalette),
  { ssr: false }
);

function typingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

function jump(id: string) {
  const node = document.getElementById(id);
  if (node) {
    node.scrollIntoView({ behavior: "smooth" });
    return;
  }
  window.location.assign(`/#${id}`);
}

/** One command hint for the top nav. */
export function CareerCommandButton() {
  return (
    <CareerButton
      variant="ghost"
      icon={Command}
      aria-label="Open the command palette"
      onClick={() => window.dispatchEvent(new Event("career-palette"))}
    >
      ⌘K
    </CareerButton>
  );
}

/** Keyboard jumps and the command palette. Render once. */
export function CareerCommand() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [help, setHelp] = useState(false);

  const showPalette = () => {
    setLoaded(true);
    setOpen(true);
  };

  useEffect(() => {
    let pending = false;
    let pendingTimer = 0;

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
    const onPalette = () => showPalette();
    window.addEventListener("keydown", onKey);
    window.addEventListener("career-help", onHelp);
    window.addEventListener("career-palette", onPalette);

    return () => {
      window.clearTimeout(pendingTimer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("career-help", onHelp);
      window.removeEventListener("career-palette", onPalette);
    };
  }, []);

  return (
    <>
      {loaded ? <CareerPalette open={open} onOpenChange={setOpen} /> : null}
      <Dialog open={help} onOpenChange={setHelp}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Shortcuts</DialogTitle>
          <DialogDescription>Keys for this page.</DialogDescription>
          <ul className="space-y-2 font-mono text-sm text-foreground">
            <li>⌘K or Ctrl K · command palette</li>
            <li>? · this sheet</li>
            <li>g then w · Work</li>
            <li>g then t · Turbo</li>
            <li>terminal · resume</li>
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
