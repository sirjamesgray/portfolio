import Image from "next/image";
import type { WorkShot } from "@/lib/public-work";
import styles from "./career-landing.module.css";

type FrameProps = {
  shot: WorkShot;
  priority?: boolean;
  sizes?: string;
};

/** Laptop bezel for a desktop screenshot. The frame is square and black. */
export function LaptopFrame({ shot, priority = false, sizes }: FrameProps) {
  return (
    <figure className={`${styles.device} w-full max-w-full`}>
      <div className={`${styles.laptop} bg-black p-[5px] pb-0`}>
        <div className="relative overflow-hidden bg-black">
          <div className="absolute left-1/2 top-1.5 z-10 h-1 w-1 -translate-x-1/2 bg-black ring-1 ring-[rgb(61_214_140/0.7)]" aria-hidden />
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            priority={priority}
            sizes={sizes ?? "(min-width: 1024px) 960px, 100vw"}
            className="h-auto w-full"
          />
        </div>
      </div>
      <div className="mx-auto h-2 w-[18%] border border-t-0 border-border bg-black" />
      <div className="mx-auto h-1 w-[32%] border border-t-0 border-border bg-black" />
    </figure>
  );
}

/** iPhone bezel. The width comes from the parent. */
export function PhoneFrame({ shot, priority = false, sizes }: FrameProps) {
  return (
    <figure className={`${styles.device} w-full max-w-full`}>
      <div className={`${styles.phone} bg-black p-[5px]`}>
        <div className="relative overflow-hidden bg-black">
          <div className="absolute left-1/2 top-1.5 z-10 h-3 w-10 -translate-x-1/2 bg-black" aria-hidden />
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            priority={priority}
            sizes={sizes ?? "(min-width: 1024px) 220px, 42vw"}
            className="h-auto w-full"
          />
        </div>
      </div>
    </figure>
  );
}
