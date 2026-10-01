"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { LaptopFrame, PhoneFrame } from "@/components/device-frame";
import { PUBLIC_PRODUCTS } from "@/lib/public-work";

const SPRING = { type: "spring" as const, stiffness: 100, damping: 20, mass: 1 };

/**
 * Desktop hero stage.
 * The Lucent phone sits on the lower corner of the WeWrite laptop.
 * Scroll moves the phone a little faster than the laptop.
 */
export function CareerHeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const laptopY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [18, -28]);
  const phoneY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [36, -64]);

  const wewrite = PUBLIC_PRODUCTS[0];
  const lucent = PUBLIC_PRODUCTS[1];
  if (!wewrite.desktop || !lucent.mobile) return null;

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[920px] pb-10 pr-6 pt-6">
      <motion.div
        style={{ y: laptopY, rotateX: reduce ? 0 : 8, rotateY: reduce ? 0 : -12 }}
        transition={SPRING}
        className="origin-center [transform:perspective(1400px)]"
      >
        <LaptopFrame
          shot={wewrite.desktop}
          priority
          sizes="(min-width: 1024px) 720px, 90vw"
        />
      </motion.div>
      <motion.div
        style={{ y: phoneY }}
        className="absolute bottom-0 right-[4%] w-[28%] max-w-[210px] [transform:perspective(900px)_rotateZ(7deg)]"
      >
        <PhoneFrame shot={lucent.mobile} priority sizes="210px" />
      </motion.div>
    </div>
  );
}
