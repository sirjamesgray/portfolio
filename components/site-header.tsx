"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { User, ArrowLeft, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Logo3DStatic } from "@/components/logo-3d";
import { CTA_CONFIG } from "@/lib/constants";

interface SiteHeaderProps {
  variant?: "default" | "back";
  backHref?: string;
  backLabel?: string;
  customerDashboardEnabled?: boolean;
}

export function SiteHeader({ variant = "default", backHref = "/", backLabel = "Back", customerDashboardEnabled = true }: SiteHeaderProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMobileFooter, setShowMobileFooter] = useState(false);

  useEffect(() => {
    // Only check user if dashboard is enabled
    if (!customerDashboardEnabled) {
      setLoading(false);
      return;
    }

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
  }, [customerDashboardEnabled]);

  // When dashboard is disabled, show Calendly flow instead
  const showDashboardLinks = customerDashboardEnabled && user;

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
          {showDashboardLinks ? (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          ) : customerDashboardEnabled ? (
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
          ) : (
            <>
              <Link href="/pricing">
                <Button variant="ghost" size="sm">
                  View pricing
                </Button>
              </Link>
              <Link href={CTA_CONFIG.dashboardDisabled.href}>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  {CTA_CONFIG.dashboardDisabled.text}
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
          {showDashboardLinks ? (
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
          ) : customerDashboardEnabled ? (
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
          ) : (
            <>
              <Link href="/pricing" className="flex-1">
                <Button variant="ghost" size="default" className="w-full h-11 px-5 text-base rounded-full">
                  View pricing
                </Button>
              </Link>
              <Link href={CTA_CONFIG.dashboardDisabled.href} className="flex-1">
                <Button size="default" className="w-full h-11 px-5 text-base rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  {CTA_CONFIG.dashboardDisabled.text}
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
            href={backHref}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        ) : (
          <Link href="/" className="flex items-center h-8 w-8">
            <Logo3DStatic size="sm" />
          </Link>
        )}
        <div className="flex items-center gap-3">
          <DesktopNavItems />
        </div>
      </header>

      {/* Mobile Header - top bar, visible on mobile only */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border/50">
        {variant === "back" ? (
          <Link
            href={backHref}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        ) : (
          <Link href="/" className="flex items-center justify-center h-11 w-11 -ml-1.5 active:opacity-70 transition-opacity">
            <Logo3DStatic size="sm" />
          </Link>
        )}
        <ThemeToggle />
      </div>

      {/* Mobile Floating Footer - hidden on desktop, appears after scrolling past hero, only on landing page */}
      <AnimatePresence>
        {showMobileFooter && variant === "default" && (
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
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 p-2 bg-white/70 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl xs:rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <MobileNavItems />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
