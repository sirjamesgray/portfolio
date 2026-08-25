"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardButton } from "@/components/ui/button";
import { LandingButton } from "@/components/ui/landing-button";
import { ScrollAwareButton } from "@/components/ui/scroll-aware-button";
import { User, ArrowLeft, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Logo3DStatic } from "@/components/logo-3d";
import { CTA_CONFIG, PRODUCT_ENGINEER_CTA } from "@/lib/constants";
import { FloatingSectionNav, type SectionNavItem } from "@/components/ui/floating-section-nav";

// Sections for product engineer landing page anchor navigation
const PRODUCT_ENGINEER_SECTIONS: SectionNavItem[] = [
  { id: "top", label: "Top" },
  { id: "problem", label: "Problem" },
  { id: "approach", label: "Approach" },
  { id: "showcase", label: "UI Showcase" },
  { id: "design-systems", label: "Design Systems" },
  { id: "projects", label: "Projects" },
  { id: "audience", label: "Who It's For" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

interface SiteHeaderProps {
  variant?: "default" | "back";
  backHref?: string;
  backLabel?: string;
  customerDashboardEnabled?: boolean;
  /** Landing page context for different CTA styles */
  landingPage?: "hire-for-projects" | "product-engineer";
}

export function SiteHeader({ variant = "default", backHref = "/", backLabel = "Back", customerDashboardEnabled = true, landingPage = "hire-for-projects" }: SiteHeaderProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMobileFooter, setShowMobileFooter] = useState(false);
  const [isStylesSectionVisible, setIsStylesSectionVisible] = useState(false);

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

  // Track when the Custom Styles section is in view to hide mobile footer
  useEffect(() => {
    const stylesSection = document.getElementById("styles");
    if (!stylesSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide footer when styles section is at least 30% visible
        setIsStylesSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observer.observe(stylesSection);
    return () => observer.disconnect();
  }, []);

  // Navigation items for desktop header
  const DesktopNavItems = () => (
    <>
      {!loading && variant === "default" && (
        <>
          {landingPage === "product-engineer" ? (
            // Product Engineer landing page: "Say hi" focused CTAs
            <>
              <ScrollAwareButton
                variant="secondary"
                size="sm"
                topText={PRODUCT_ENGINEER_CTA.secondary.text}
                scrolledText="Back to Top"
              />
              <Link href={PRODUCT_ENGINEER_CTA.primary.href}>
                <LandingButton variant="primary" size="sm">
                  {PRODUCT_ENGINEER_CTA.primary.text}
                </LandingButton>
              </Link>
            </>
          ) : showDashboardLinks ? (
            <Link href="/dashboard">
              <DashboardButton variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Dashboard
              </DashboardButton>
            </Link>
          ) : customerDashboardEnabled ? (
            <>
              <Link href="/login">
                <DashboardButton variant="ghost" size="sm">
                  Log in
                </DashboardButton>
              </Link>
              <Link href="/start-project">
                <LandingButton variant="primary" size="sm">
                  Start Project
                </LandingButton>
              </Link>
            </>
          ) : (
            <>
              <Link href="/pricing">
                <LandingButton variant="secondary" size="sm">
                  View pricing
                </LandingButton>
              </Link>
              <Link href={CTA_CONFIG.dashboardDisabled.href}>
                <LandingButton variant="primary" size="sm">
                  {CTA_CONFIG.dashboardDisabled.text}
                </LandingButton>
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
          {landingPage === "product-engineer" ? (
            // Product Engineer landing page: "Say hi" focused CTAs
            <>
              <ScrollAwareButton
                variant="secondary"
                className="flex-1 w-full"
                topText={PRODUCT_ENGINEER_CTA.secondary.text}
                scrolledText="Back to Top"
              />
              <Link href={PRODUCT_ENGINEER_CTA.primary.href} className="flex-1">
                <LandingButton variant="primary" className="w-full">
                  {PRODUCT_ENGINEER_CTA.primary.text}
                </LandingButton>
              </Link>
            </>
          ) : showDashboardLinks ? (
            <>
              <DashboardButton
                variant="ghost-destructive"
                size="default"
                className="flex-1 gap-2 h-11 px-5 text-base rounded-full"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Log out
              </DashboardButton>
              <Link href="/dashboard" className="flex-1">
                <LandingButton variant="primary" className="w-full gap-2">
                  <User className="h-5 w-5" />
                  Dashboard
                </LandingButton>
              </Link>
            </>
          ) : customerDashboardEnabled ? (
            <>
              <Link href="/login" className="flex-1">
                <DashboardButton variant="ghost" size="default" className="w-full h-11 px-5 text-base rounded-full">
                  Log in
                </DashboardButton>
              </Link>
              <Link href="/start-project" className="flex-1">
                <LandingButton variant="primary" className="w-full">
                  Start Project
                </LandingButton>
              </Link>
            </>
          ) : (
            <>
              <Link href="/pricing" className="flex-1">
                <LandingButton variant="secondary" className="w-full">
                  View pricing
                </LandingButton>
              </Link>
              <Link href={CTA_CONFIG.dashboardDisabled.href} className="flex-1">
                <LandingButton variant="primary" className="w-full">
                  {CTA_CONFIG.dashboardDisabled.text}
                </LandingButton>
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

      {/* Mobile Floating Footer - hidden on desktop, appears after scrolling past hero, only on landing page, hides when styles section is visible */}
      <AnimatePresence>
        {showMobileFooter && variant === "default" && !isStylesSectionVisible && (
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
            <div className="p-3 bg-white/70 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-[var(--shadow-elevation-md)]">
              {landingPage === "product-engineer" ? (
                <div className="flex flex-col gap-3">
                  <FloatingSectionNav sections={PRODUCT_ENGINEER_SECTIONS} />
                  <Link href={PRODUCT_ENGINEER_CTA.primary.href} className="block">
                    <LandingButton variant="primary" className="w-full">
                      {PRODUCT_ENGINEER_CTA.primary.text}
                    </LandingButton>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                  <MobileNavItems />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
