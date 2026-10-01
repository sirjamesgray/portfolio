"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function AdminLink() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <span className="text-xs text-muted-foreground">
        Admin
      </span>
    );
  }

  return (
    <Link
      href={isLoggedIn ? "/dashboard" : "/login"}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {isLoggedIn ? "Dashboard" : "Admin"}
    </Link>
  );
}
