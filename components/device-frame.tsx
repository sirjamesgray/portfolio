import Image from "next/image";
import type { WorkShot } from "@/lib/public-work";
import styles from "./career-landing.module.css";

type FrameProps = {
  shot: WorkShot;
  priority?: boolean;
  sizes?: string;
};

/**
 * Laptop bezel for a desktop screenshot.
 * Open Props shadow-5 sits on the frame. A thin reflection sits on the glass.
 */
export function LaptopFrame({ shot, priority = false, sizes }: FrameProps) {
  return (
    <figure className={`${styles.device} w-full max-w-full`}>
      <div className={`${styles.laptop} rounded-[1.05rem] bg-[#0c0c0e] p-[5px] pb-0`}>
        <div className="relative overflow-hidden rounded-t-[0.7rem] bg-black">
          <div className="absolute left-1/2 top-1.5 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-zinc-600" aria-hidden />
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            priority={priority}
            sizes={sizes ?? "(min-width: 1024px) 960px, 100vw"}
            className="h-auto w-full"
          />
          <div className={styles.glass} aria-hidden />
        </div>
      </div>
      <div className="mx-auto h-2 w-[18%] rounded-b-md bg-[#2a2a2c]" />
      <div className="mx-auto h-1 w-[32%] rounded-b-md bg-[#3a3a3c]" />
    </figure>
  );
}

/** iPhone bezel. The width comes from the parent. */
export function PhoneFrame({ shot, priority = false, sizes }: FrameProps) {
  return (
    <figure className={`${styles.device} w-full max-w-full`}>
      <div className={`${styles.phone} rounded-[1.35rem] bg-[#0c0c0e] p-[5px]`}>
        <div className="relative overflow-hidden rounded-[1.05rem] bg-black">
          <div className="absolute left-1/2 top-1.5 z-10 h-3 w-10 -translate-x-1/2 rounded-full bg-black" aria-hidden />
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            priority={priority}
            sizes={sizes ?? "(min-width: 1024px) 220px, 42vw"}
            className="h-auto w-full"
          />
          <div className={styles.glass} aria-hidden />
        </div>
      </div>
    </figure>
  );
}
