"use client";

import { GlowCapture } from "@codaworks/react-glow";

export function GlowWrapper({ children }: { children: React.ReactNode }) {
  return <GlowCapture>{children}</GlowCapture>;
}
