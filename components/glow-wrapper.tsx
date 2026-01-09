"use client";

import { usePathname } from "next/navigation";
import { GlowCapture } from "@codaworks/react-glow";

export function GlowWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Skip GlowCapture for dashboard pages - it interferes with scrolling
  if (pathname?.startsWith("/dashboard")) {
    return <>{children}</>;
  }

  return <GlowCapture>{children}</GlowCapture>;
}
