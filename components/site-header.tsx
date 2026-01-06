"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogoSVG } from "@/components/logo";
import { User, ArrowLeft } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Dynamically import 3D logo to avoid SSR issues
const Logo3D = dynamic(
  () => import("@/components/logo-3d").then((mod) => mod.Logo3D),
  {
    ssr: false,
    loading: () => <LogoSVG size="md" />,
  }
);

interface SiteHeaderProps {
  variant?: "default" | "back";
}

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border/50">
      {variant === "back" ? (
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      ) : (
        <Link href="/" className="flex items-center">
          <Logo3D size="md" static />
        </Link>
      )}
      <div className="flex items-center gap-3">
        {!loading && variant === "default" && (
          <>
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/start-project">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                    Start Project
                  </Button>
                </Link>
              </>
            )}
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
