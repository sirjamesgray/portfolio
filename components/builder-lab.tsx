"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { BUILDER_LOG } from "@/lib/builder-log";
import styles from "./career-landing.module.css";

const LabAscii = dynamic(() => import("@/components/lab-ascii").then((mod) => mod.LabAscii), {
  ssr: false,
  loading: () => <div className="h-44 w-full" />,
});

const STEPS = ["prompt", "agent", "PR", "preview", "ship"] as const;

const BEFORE = [
  "const pages = db.collection(\"pages\")",
  "const page = await pages.get(id)",
];

const AFTER = [
  "const page = await api.pages.get(id)",
  "type Page = { id: string }",
];

function TogglesCard() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [dense, setDense] = useState(false);
  const [motion, setMotion] = useState(true);

  return (
    <div
      data-theme={theme}
      className={`${theme === "dark" ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"} rounded-md border border-border ${dense ? "p-2" : "p-4"}`}
    >
      <div className="flex flex-wrap gap-2 font-mono text-[11px]">
        <button type="button" className="rounded border border-current/20 px-2 py-1" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          theme {theme}
        </button>
        <button type="button" className="rounded border border-current/20 px-2 py-1" onClick={() => setDense((value) => !value)}>
          density {dense ? "tight" : "roomy"}
        </button>
        <button type="button" className="rounded border border-current/20 px-2 py-1" onClick={() => setMotion((value) => !value)}>
          motion {motion ? "on" : "off"}
        </button>
      </div>
      <div className={`mt-4 h-2 w-16 rounded-full bg-current/80 ${motion ? styles.pulse : ""}`} />
    </div>
  );
}

function DiffCard() {
  return (
    <div className="grid gap-2 font-mono text-[11px] leading-relaxed sm:grid-cols-2">
      <pre className="overflow-x-auto rounded-md bg-red-500/10 p-3 text-foreground">
        {BEFORE.map((line) => (
          <div key={line}>- {line}</div>
        ))}
      </pre>
      <pre className="overflow-x-auto rounded-md bg-emerald-500/10 p-3 text-foreground">
        {AFTER.map((line) => (
          <div key={line}>+ {line}</div>
        ))}
      </pre>
      <p className="sm:col-span-2 text-muted-foreground">
        A full JavaScript to TypeScript migration, plus an API layer in place of direct database calls.
      </p>
    </div>
  );
}

function AgentCard() {
  return (
    <ol className={`${styles.flow} flex flex-wrap gap-2`}>
      {STEPS.map((step, index) => (
        <li key={step} className="rounded-md border border-border px-2 py-1 font-mono text-[11px]" style={{ animationDelay: `${index * 280}ms` }}>
          {step}
        </li>
      ))}
    </ol>
  );
}

function CardShell({ file, title, children }: { file: string; title: string; children: React.ReactNode }) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
        <span className="font-mono text-xs text-muted-foreground">{file}</span>
        <span className="font-mono text-[11px] text-foreground">{title}</span>
      </div>
      <div className="p-3">{children}</div>
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
          </CardShell>
        );
      })}
    </div>
  );
}
