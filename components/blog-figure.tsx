"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import styles from "@/app/blog/blog.module.css";

type Props = { src: string; alt: string; caption?: string; width: number; height: number };

/** A blog figure. A click opens the full size image in a modal dialog. */
export function BlogFigure({ src, alt, caption, width, height }: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      dialog.querySelector<HTMLButtonElement>("button")?.focus();
    } else if (dialog.open) {
      dialog.close();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  function onKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])");
    if (!focusables?.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  return (
    <figure className={styles.figure}>
      <button ref={triggerRef} type="button" className={styles.figureButton} onClick={() => setOpen(true)} aria-label={`View full size: ${alt}`}>
        <Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 768px) 100vw, 720px" className={styles.figureImage} />
      </button>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-label={caption ?? alt}
        onKeyDown={onKeyDown}
        onClose={() => { setOpen(false); triggerRef.current?.focus(); }}
        onCancel={(e) => { e.preventDefault(); setOpen(false); }}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        {open ? (
          <div className={styles.lightboxInner} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
            <button type="button" className={styles.lightboxClose} onClick={() => setOpen(false)} aria-label="Close image">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <Image src={src} alt={alt} width={width} height={height} sizes="100vw" quality={90} className={styles.lightboxImage} />
            {caption ? <p className={styles.caption}>{caption}</p> : null}
          </div>
        ) : null}
      </dialog>
    </figure>
  );
}
