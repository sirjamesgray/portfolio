"use client";

import Link from "next/link";
import Image from "next/image";
import type { WorkEntry } from "@/lib/work-catalog";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3dd68c]";

function borderFor(tone: WorkEntry["tone"]) {
  return tone === "blue"
    ? "border-[rgb(112_184_255/0.4)] hover:shadow-[0_0_28px_rgb(112_184_255/0.28)]"
    : "border-[rgb(61_214_140/0.4)] hover:shadow-[0_0_28px_rgb(61_214_140/0.28)]";
}

function hardNavigate(slug: string) {
  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    event.preventDefault();
    sessionStorage.setItem("work-return-focus", slug);
    window.location.assign(`/work/${slug}`);
  };
}

export function WorkLink({
  slug,
  className,
  children,
}: {
  slug: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={`/work/${slug}`} scroll={false} className={className} onClick={hardNavigate(slug)}>
      {children}
    </Link>
  );
}

export function WorkCard({ entry }: { entry: WorkEntry }) {
  const earnsTone = entry.tone === "blue" ? "text-blue" : "text-brand";

  return (
    <Link
      id={`work-card-${entry.slug}`}
      href={`/work/${entry.slug}`}
      scroll={false}
      onClick={hardNavigate(entry.slug)}
      className={`flex h-full flex-col border bg-black p-3 text-left transition-shadow ${borderFor(entry.tone)} ${FOCUS}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden border border-inherit bg-black">
        {entry.cover ? (
          <Image
            src={entry.cover.src}
            alt={entry.cover.alt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <p className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">Text only</p>
        )}
      </div>
      <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-foreground">{entry.name}</h3>
      <p className="mt-1 line-clamp-1 text-sm text-foreground">{entry.line}</p>
      <p className="mt-2 font-mono text-xs text-muted-foreground">{entry.dates}</p>
      {entry.earns ? (
        <p className="mt-3 text-sm leading-relaxed text-foreground">
          <span className={`font-mono text-xs ${earnsTone}`}>Who earns · </span>
          {entry.earns}
        </p>
      ) : null}
    </Link>
  );
}

export function WorkGrid({ entries }: { entries: readonly WorkEntry[] }) {
  return (
    <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <li key={entry.slug} id={entry.slug} className="scroll-mt-28">
          <WorkCard entry={entry} />
        </li>
      ))}
    </ul>
  );
}
