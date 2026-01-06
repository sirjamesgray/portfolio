"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogoSVG } from "@/components/logo";
import { User, ArrowLeft, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Dynamically import 3D logo to avoid SSR issues
const Logo3D = dynamic(
  () => import("@/components/logo-3d").then((mod) => mod.Logo3D),
  {
    ssr: false,
    loading: () => null,
  }
);

interface SiteHeaderProps {
  variant?: "default" | "back";
}

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMobileFooter, setShowMobileFooter] = useState(false);

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

  // Track scroll position to show mobile footer after hero section
  useEffect(() => {
    const handleScroll = () => {
      // Show footer after scrolling past ~60% of viewport height (past hero)
      const scrollThreshold = window.innerHeight * 0.6;
      setShowMobileFooter(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items for desktop header
  const DesktopNavItems = () => (
    <>
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
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  Start Project
                </Button>
              </Link>
            </>
          )}
        </>
      )}
      <ThemeToggle />
    </>
  );

  const handleLogout = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Navigation items for mobile floating footer (no theme toggle)
  const MobileNavItems = () => (
    <>
      {!loading && variant === "default" && (
        <>
          {user ? (
            <>
              <Button
                variant="ghost-destructive"
                size="default"
                className="flex-1 gap-2 h-11 px-5 text-base rounded-full"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Log out
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button size="default" className="w-full gap-2 h-11 px-5 text-base rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <User className="h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="flex-1">
                <Button variant="ghost" size="default" className="w-full h-11 px-5 text-base rounded-full">
                  Log in
                </Button>
              </Link>
              <Link href="/start-project" className="flex-1">
                <Button size="default" className="w-full h-11 px-5 text-base rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  Start Project
                </Button>
              </Link>
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Header - hidden on mobile */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border/50">
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
            <Logo3D size="sm" static />
          </Link>
        )}
        <div className="flex items-center gap-3">
          <DesktopNavItems />
        </div>
      </header>

      {/* Mobile Theme Toggle - top right, visible on mobile only */}
      <div className="md:hidden absolute top-4 right-4 z-40">
        <ThemeToggle />
      </div>

      {/* Mobile Floating Footer - hidden on desktop, appears after scrolling past hero */}
      <AnimatePresence>
        {showMobileFooter && (
          <motion.div
            className="md:hidden fixed bottom-6 left-4 right-4 z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 1,
            }}
          >
            <div className="flex items-center gap-2 p-2 bg-white/70 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <MobileNavItems />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
