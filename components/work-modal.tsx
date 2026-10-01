"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3dd68c]";

function focusables(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex='-1'])")].filter(
    (node) => !node.hasAttribute("disabled")
  );
}

export function WorkModal({
  slug,
  title,
  children,
}: {
  slug: string;
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const panel = useRef<HTMLDivElement>(null);

  const close = () => router.back();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-close]")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        router.back();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const nodes = focusables(panel.current);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      document.getElementById(`work-card-${slug}`)?.focus();
    };
  }, [router, slug]);

  return (
    <div className="fixed inset-0 z-[60] bg-black/80" onClick={close}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`work-dialog-${slug}`}
        className="absolute inset-3 flex flex-col border border-[rgb(61_214_140/0.4)] bg-black sm:inset-6 lg:inset-10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p id={`work-dialog-${slug}`} className="truncate font-mono text-xs text-muted-foreground">
            {title}
          </p>
          <div className="flex shrink-0 gap-2">
            <button type="button" className={`border border-border bg-black px-3 py-1 text-sm text-foreground ${FOCUS}`} onClick={close}>
              Back
            </button>
            <button type="button" data-close className={`border border-[rgb(112_184_255/0.45)] bg-black px-3 py-1 text-sm text-[#70b8ff] ${FOCUS}`} onClick={close}>
              Close
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}

export function WorkPageChrome({ slug }: { slug: string }) {
  const router = useRouter();
  const href = `/#work-card-${slug}`;

  const mark = () => sessionStorage.setItem("work-return-focus", slug);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      sessionStorage.setItem("work-return-focus", slug);
      router.push(`/#work-card-${slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, slug]);

  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <a href={href} onClick={mark} className={`text-sm text-brand underline-offset-4 hover:underline ${FOCUS}`}>
        Back
      </a>
      <a href={href} onClick={mark} className={`border border-[rgb(112_184_255/0.45)] px-3 py-1 text-sm text-[#70b8ff] ${FOCUS}`}>
        Close
      </a>
    </div>
  );
}

export function WorkFocusRestore() {
  useEffect(() => {
    const stored = sessionStorage.getItem("work-return-focus");
    const hashed = window.location.hash.startsWith("#work-card-") ? window.location.hash.slice("#work-card-".length) : "";
    const slug = stored || hashed;
    if (!slug) return;
    sessionStorage.removeItem("work-return-focus");
    const card = document.getElementById(`work-card-${slug}`);
    if (!card) return;
    card.scrollIntoView({ block: "center", behavior: "auto" });
    card.focus({ preventScroll: true });
  }, []);

  return null;
}
