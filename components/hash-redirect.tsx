"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routeForHash } from "@/lib/section-routes";

/** Send old home page anchors, such as /#work, to their new pages. */
export function HashRedirect() {
  const router = useRouter();
  useEffect(() => {
    const go = () => {
      const target = routeForHash(window.location.hash);
      if (target) router.replace(target);
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, [router]);
  return null;
}
