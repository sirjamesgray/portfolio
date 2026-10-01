"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { BUILDER_LOG } from "@/lib/builder-log";
import styles from "./career-landing.module.css";

const LabAscii = dynamic(() => import("@/components/lab-ascii").then((mod) => mod.LabAscii), {
  ssr: false,
  loading: () => <div className="h-44 w-full" />,
});

const STEPS = ["prompt", "agent", "PR", "preview", "ship"] as const;

const ACCENTS = [
  { name: "brand", value: "oklch(0.696 0.17 162.48)" },
  { name: "WeWrite", value: "#2599FF" },
  { name: "Lucent", value: "#0EA5E9" },
] as const;

const EASINGS = [
  { name: "ease-3", value: "cubic-bezier(0.25, 0, 0.3, 1)", path: "M0,46 C25,46 30,2 100,2" },
  { name: "ease-out-3", value: "cubic-bezier(0, 0, 0.3, 1)", path: "M0,46 C0,2 30,2 100,2" },
  { name: "ease-5", value: "cubic-bezier(0.25, 0, 0.1, 1)", path: "M0,46 C25,46 10,2 100,2" },
] as const;

const DIFF = [
  { kind: "del" as const, text: 'const pages = db.collection("pages")' },
  { kind: "del" as const, text: "const page = await pages.get(id)" },
  { kind: "add" as const, text: "const page = await api.pages.get(id)" },
  { kind: "add" as const, text: "type Page = { id: string }" },
];

function motionOff() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function TogglesCard() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [dense, setDense] = useState(false);
  const [motion, setMotion] = useState(true);
  const [accent, setAccent] = useState(0);
  const color = ACCENTS[accent];
  const dark = theme === "dark";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
        <button type="button" className="rounded border border-border px-2 py-1" onClick={() => setTheme(dark ? "light" : "dark")}>
          theme {theme}
        </button>
        <button type="button" className="rounded border border-border px-2 py-1" onClick={() => setDense((value) => !value)}>
          density {dense ? "tight" : "roomy"}
        </button>
        <button type="button" className="rounded border border-border px-2 py-1" onClick={() => setMotion((value) => !value)}>
          motion {motion ? "on" : "off"}
        </button>
        <button type="button" className="rounded border border-border px-2 py-1" onClick={() => setAccent((value) => (value + 1) % ACCENTS.length)}>
          accent {color.name}
        </button>
      </div>
      <div className={`${dark ? "bg-zinc-950 text-zinc-100" : "bg-white text-zinc-900"} overflow-hidden rounded-md border border-border`}>
        <div className="border-b border-current/10 px-3 py-1 font-mono text-[10px] opacity-60">preview.tsx</div>
        <div className={dense ? "space-y-2 p-2" : "space-y-4 p-4"}>
          <p className={dense ? "text-sm font-medium" : "text-base font-medium"}>Write a page</p>
          <p className="text-xs opacity-70">A social wiki where every page is a fundraiser.</p>
          <button
            type="button"
            className={`rounded-md px-3 py-1.5 text-xs font-medium text-white ${motion ? styles.pulse : ""}`}
            style={{ background: color.value }}
          >
            Write
          </button>
        </div>
      </div>
    </div>
  );
}

function DiffCard() {
  const [count, setCount] = useState(DIFF.length);
  const [typed, setTyped] = useState(DIFF.length);

  useEffect(() => {
    if (motionOff()) return;
    const timers = DIFF.map((_, index) =>
      window.setTimeout(() => {
        setCount(index + 1);
        setTyped(index + 1);
      }, 280 * (index + 1))
    );
    const start = window.setTimeout(() => {
      setCount(0);
      setTyped(0);
    }, 40);
    return () => {
      window.clearTimeout(start);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div className="min-w-0">
      <ol className="max-w-full space-y-1 overflow-x-auto font-mono text-[11px] leading-relaxed">
        {DIFF.slice(0, count).map((line, index) => {
          const shown = line.kind === "add" && index === count - 1 ? line.text.slice(0, Math.max(1, typed)) : line.text;
          return (
            <li
              key={line.text}
              className={`whitespace-pre-wrap break-all rounded px-2 py-0.5 ${line.kind === "del" ? `${styles.delLine} bg-red-500/10` : "bg-emerald-500/10"}`}
            >
              {line.kind === "del" ? "- " : "+ "}
              {shown}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        A full JavaScript to TypeScript migration, plus an API layer in place of direct database calls.
      </p>
    </div>
  );
}

function AgentCard() {
  return (
    <div>
      <div className="relative">
        <span className={styles.token} aria-hidden />
        <ol className="grid grid-cols-5 gap-1 pt-4">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className={`${styles.flow} min-w-0 break-words rounded-md border border-border px-1 py-2 text-center font-mono text-[10px] leading-tight sm:text-[11px]`}
              style={{ animationDelay: `${index * 1000}ms` }}
            >
              {step}
            </li>
          ))}
        </ol>
      </div>
      <ol className="mt-3 space-y-1 font-mono text-[11px] text-muted-foreground">
        {STEPS.map((step, index) => (
          <li key={step} className={styles.logItem} style={{ animationDelay: `${index}s` }}>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

function SpringCard() {
  const [ease, setEase] = useState(0);
  const [spot, setSpot] = useState(12);
  const [reduce, setReduce] = useState(false);
  const curve = EASINGS[ease];

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {EASINGS.map((item, index) => (
          <button
            key={item.name}
            type="button"
            className={`rounded border px-2 py-1 font-mono text-[11px] ${index === ease ? "border-foreground" : "border-border"}`}
            onClick={() => setEase(index)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <label className="block font-mono text-[11px] text-muted-foreground">
        travel
        <input
          type="range"
          min={8}
          max={92}
          value={spot}
          onChange={(event) => setSpot(Number(event.target.value))}
          className="mt-1 block w-full"
        />
      </label>
      <svg viewBox="0 0 100 48" className="h-16 w-full text-foreground" aria-hidden>
        <path d={curve.path} fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <div className="relative h-8 rounded-full border border-border">
        <span
          className="absolute top-1 size-6 rounded-full bg-brand"
          style={{
            left: `calc(${spot}% - 0.75rem)`,
            transition: reduce ? "none" : `left 700ms ${curve.value}`,
          }}
        />
      </div>
      <p className="font-mono text-[10px] text-muted-foreground">{curve.value}</p>
    </div>
  );
}

function SwatchCard() {
  const [note, setNote] = useState("");

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setNote("Copied");
    } catch {
      setNote(value);
    }
    window.setTimeout(() => setNote(""), 1200);
  };

  return (
    <div className="space-y-2">
      {ACCENTS.map((swatch) => (
        <button
          key={swatch.name}
          type="button"
          onClick={() => copy(swatch.value)}
          className="flex w-full items-center gap-3 rounded-md border border-border px-2 py-2 text-left"
        >
          <span className="size-8 shrink-0 rounded-md border border-border" style={{ background: swatch.value }} />
          <span className="min-w-0">
            <span className="block font-mono text-xs text-foreground">{swatch.name}</span>
            <span className="block truncate font-mono text-[10px] text-muted-foreground">{swatch.value}</span>
          </span>
        </button>
      ))}
      <p className="h-4 font-mono text-[11px] text-foreground" role="status">
        {note}
      </p>
    </div>
  );
}

function CardShell({ file, title, children }: { file: string; title: string; children: React.ReactNode }) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 py-2">
        <span className="font-mono text-xs text-muted-foreground">{file}</span>
        <span className="font-mono text-[11px] text-foreground">{title}</span>
      </div>
      <div className="min-w-0 p-3">{children}</div>
    </article>
  );
}

export function BuilderLab() {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {BUILDER_LOG.map((entry) => {
        if (entry.kind === "note") {
          return (
            <article key={entry.id} className="rounded-lg border border-dashed border-border p-4">
              <p className="font-mono text-[11px] tracking-[0.14em] text-foreground">TODO · draft</p>
              <h3 className="mt-2 font-mono text-sm text-foreground">{entry.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{entry.body}</p>
            </article>
          );
        }

        return (
          <CardShell key={entry.id} file={entry.file} title={entry.title}>
            {entry.id === "toggles" ? <TogglesCard /> : null}
            {entry.id === "ascii" ? <LabAscii /> : null}
            {entry.id === "diff" ? <DiffCard /> : null}
            {entry.id === "agent" ? <AgentCard /> : null}
            {entry.id === "spring" ? <SpringCard /> : null}
            {entry.id === "swatch" ? <SwatchCard /> : null}
          </CardShell>
        );
      })}
    </div>
  );
}
