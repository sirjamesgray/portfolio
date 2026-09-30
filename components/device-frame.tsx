import Image from "next/image";
import type { WorkShot } from "@/lib/public-work";

type FrameProps = {
  shot: WorkShot;
  priority?: boolean;
  /** Let a tall capture scroll inside the screen. */
  scroll?: boolean;
};

/**
 * Laptop bezel for a desktop screenshot.
 * The base stays inside the parent so the page does not scroll sideways.
 */
export function LaptopFrame({ shot, priority = false, scroll = false }: FrameProps) {
  return (
    <figure className="w-full max-w-full">
      <div className="rounded-t-xl bg-zinc-950 p-1.5 pb-0 shadow-[0_22px_40px_-28px_rgba(0,0,0,0.55)] ring-1 ring-black/40 dark:ring-white/15">
        <div className="relative overflow-hidden rounded-t-[0.4rem] bg-black">
          <div
            className="absolute left-1/2 top-1.5 z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-zinc-700"
            aria-hidden
          />
          <div className={scroll ? "max-h-[min(52vh,420px)] overflow-y-auto overflow-x-hidden" : undefined}>
            <Image
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              priority={priority}
              sizes="(min-width: 1024px) 720px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
      <div className="h-2 rounded-b-md bg-zinc-800 ring-1 ring-black/40 dark:ring-white/10" />
      <div className="mx-auto h-1.5 w-[72%] rounded-b-md bg-zinc-600" />
    </figure>
  );
}

/**
 * iPhone bezel for a mobile screenshot.
 * Width stays under the smallest phone viewport.
 */
export function PhoneFrame({ shot, priority = false }: FrameProps) {
  return (
    <figure className="mx-auto w-full max-w-[200px]">
      <div className="rounded-[1.7rem] bg-zinc-950 p-[7px] shadow-[0_18px_36px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/40 dark:ring-white/15">
        <div className="relative overflow-hidden rounded-[1.25rem] bg-black">
          <div
            className="absolute left-1/2 top-1.5 z-10 h-3.5 w-12 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10"
            aria-hidden
          />
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            priority={priority}
            sizes="200px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </figure>
  );
}

/** Still frame for a tall case-study board. The board scrolls inside the frame. */
export function StudyFrame({ shot }: { shot: WorkShot }) {
  return (
    <figure className="overflow-hidden rounded-md bg-zinc-100 ring-1 ring-black/10 dark:bg-zinc-900 dark:ring-white/10">
      <div className="max-h-[420px] overflow-y-auto overflow-x-hidden sm:max-h-[480px]">
        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          sizes="(min-width: 1024px) 360px, 100vw"
          className="h-auto w-full"
        />
      </div>
    </figure>
  );
}
