"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { WorkEntry } from "@/lib/work-catalog";
import { careerButtonClass } from "@/components/career-button";
import styles from "./career-system.module.css";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3dd68c]";

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
  return (
    <Link
      id={`work-card-${entry.slug}`}
      href={`/work/${entry.slug}`}
      scroll={false}
      onClick={hardNavigate(entry.slug)}
      className={`${styles.card} ${FOCUS}`}
    >
      <div className={styles.cover}>
        {entry.cover ? (
          <Image
            src={entry.cover.src}
            alt={entry.cover.alt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <p className={`${styles.kicker} flex h-full items-center justify-center`}>Text only</p>
        )}
      </div>
      <p className={styles.kicker}>{entry.role}</p>
      <h3 className="text-[length:var(--type-4)] font-semibold tracking-[-0.02em] text-foreground">{entry.name}</h3>
      <p className={styles.small}>{entry.shipped}</p>
      {entry.stack.length > 0 ? (
        <ul className={styles.tags}>
          {entry.stack.map((tool) => (
            <li key={tool} className={styles.tag}>
              {tool}
            </li>
          ))}
        </ul>
      ) : null}
      <p className={styles.kicker}>{entry.dates}</p>
      <span className={careerButtonClass("secondary", "sm")}>
        <ArrowRight aria-hidden />
        Open
      </span>
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
