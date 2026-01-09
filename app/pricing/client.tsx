"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, Rocket, Ship, ArrowRight, Calendar, RefreshCw } from "lucide-react";
import { LandingButton } from "@/components/ui/landing-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { SiteHeader } from "@/components/site-header";
import { SITE_CONFIG, CTA_CONFIG } from "@/lib/constants";

// Centralized feature definitions - single source of truth for desktop and mobile
const TIER_FEATURES = {
  starter: [
    "Multiple pages",
    "Clean, professional design",
    "Mobile-friendly & responsive",
    "Deployed & live on the internet",
  ] as string[],
  standard: [
    "Content management system",
    "User accounts & sign-in",
    "Contact forms",
  ] as string[],
  premium: [
    "Email notifications",
    "Admin dashboard",
    "Performance optimization",
  ] as string[],
};

// All features in order for comparison view
const ALL_FEATURES: string[] = [
  ...TIER_FEATURES.starter,
  ...TIER_FEATURES.standard,
  ...TIER_FEATURES.premium,
];

const projects = [
  {
    value: "1-week-mvp",
    name: "1-Week Starter",
    price: "$2,500",
    description: "A polished website, fast",
    icon: Zap,
    // Starter only shows its own features
    features: TIER_FEATURES.starter,
    // For desktop additive display
    additiveFeatures: TIER_FEATURES.starter,
    previousTier: null,
  },
  {
    value: "2-week-build",
    name: "2-Week Standard",
    price: "$5,000",
    description: "Add a database & user accounts",
    icon: Rocket,
    // Standard's unique features
    features: TIER_FEATURES.standard,
    // Desktop shows starter + standard
    additiveFeatures: [...TIER_FEATURES.starter, ...TIER_FEATURES.standard],
    previousTier: "1-Week Starter",
    popular: true,
  },
  {
    value: "3-week-ship",
    name: "3-Week Premium",
    price: "$9,000",
    description: "Integrations & advanced features",
    icon: Ship,
    // Premium's unique features
    features: TIER_FEATURES.premium,
    // Desktop shows all tiers combined
    additiveFeatures: [...TIER_FEATURES.starter, ...TIER_FEATURES.standard, ...TIER_FEATURES.premium],
    previousTier: "2-Week Standard",
  },
];

const included = [
  "Daily updates sent to your inbox",
  "You own all the code",
  "Website hosting setup",
  "1 week of free fixes after launch",
];

const optional = [
  "Writing website content for you",
  "Help with Google rankings",
];

const notIncluded = [
  "Monthly updates (available separately)",
  "Advertising or marketing",
];

interface PricingPageClientProps {
  customerDashboardEnabled: boolean;
}

export function PricingPageClient({ customerDashboardEnabled }: PricingPageClientProps) {
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [showMobileFooter, setShowMobileFooter] = useState(false);

  // Track scroll position to show mobile footer after scrolling a bit
  useEffect(() => {
    const handleScroll = () => {
      // Show footer after scrolling past ~40% of viewport height
      const scrollThreshold = window.innerHeight * 0.4;
      setShowMobileFooter(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash-based scrolling on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    if (hash) {
      // Small delay to ensure DOM is fully rendered after animations
      const timer = setTimeout(() => {
        const element = cardRefs.current.get(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Add a subtle highlight effect
          element.classList.add("ring-2", "ring-emerald-500", "ring-offset-2", "ring-offset-background");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-emerald-500", "ring-offset-2", "ring-offset-background");
          }, 2000);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="back" backHref="/#pricing" backLabel="Home" />

      <main className="pt-20 pb-28 md:pb-16">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header */}
          <BlurFade delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Simple Pricing
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                One flat price. No hidden fees. Know exactly what you&apos;re paying.
              </p>
            </div>
          </BlurFade>

          {/* Project Cards */}
          <BlurFade delay={0.2}>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {projects.map((project) => {
                const Icon = project.icon;
                return (
                  <div
                    key={project.value}
                    id={project.value}
                    ref={(el) => {
                      if (el) cardRefs.current.set(project.value, el);
                    }}
                    className={`relative rounded-2xl border p-6 transition-all ${
                      project.popular
                        ? "border-emerald-500 dark:border-emerald-400 bg-emerald-500/5"
                        : "border-border bg-card/50"
                    }`}
                  >
                    {project.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        project.popular
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">{project.price}</span>
                      <span className="text-muted-foreground ml-1">flat</span>
                    </div>

                    {/* Desktop: Show all features with included/not-included styling */}
                    <ul className="hidden md:block space-y-3 mb-6">
                      {ALL_FEATURES.map((feature) => {
                        const isIncluded = project.additiveFeatures.includes(feature);
                        const isNewInTier = project.features.includes(feature);
                        return (
                          <li key={feature} className="flex items-start gap-2">
                            {isIncluded ? (
                              isNewInTier ? (
                                // New feature for this tier - prominent green circle with white check
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 shrink-0 mt-0.5">
                                  <Check className="h-3 w-3 text-white" />
                                </span>
                              ) : (
                                // Inherited from previous tier - standard check
                                <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              )
                            ) : (
                              // Not included - grey X
                              <X className="h-5 w-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                            )}
                            <span className={isIncluded ? "text-foreground" : "text-muted-foreground/50"}>
                              {feature}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Mobile: Show tier-specific features + "includes previous" note */}
                    <div className="md:hidden mb-6">
                      {project.previousTier && (
                        <p className="text-sm text-muted-foreground mb-3 italic">
                          Everything in {project.previousTier}, plus:
                        </p>
                      )}
                      <ul className="space-y-3">
                        {project.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                );
              })}
            </div>
          </BlurFade>

          {/* What's Included / Optional / Not Included */}
          <BlurFade delay={0.3}>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {/* Included */}
              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <h3 className="text-lg font-semibold text-foreground text-center">
                  What&apos;s Included
                </h3>
                <div className="border-b border-border my-4" />
                <ul className="space-y-3">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Optional Add-ons */}
              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <h3 className="text-lg font-semibold text-foreground text-center">
                  Optional Add-ons
                </h3>
                <div className="border-b border-border my-4" />
                <ul className="space-y-3">
                  {optional.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Included */}
              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <h3 className="text-lg font-semibold text-foreground text-center">
                  Not Included
                </h3>
                <div className="border-b border-border my-4" />
                <ul className="space-y-3">
                  {notIncluded.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </BlurFade>

          {/* Ongoing Support Section */}
          <BlurFade delay={0.4}>
            <div className="rounded-2xl border border-border bg-card/50 p-8 text-center mb-16">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <RefreshCw className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Need Help After Launch?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Once your site is live, I can stick around to make updates, add new features, and keep things running smoothly.
                We&apos;ll talk about what works for you.
              </p>
              <p className="text-sm text-muted-foreground">
                Monthly plans start at <span className="font-medium text-foreground">$1,500/month</span>
              </p>
            </div>
          </BlurFade>

          {/* CTA - Hidden on mobile since we have floating bar */}
          <BlurFade delay={0.5}>
            <div className="text-center hidden md:block">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground mb-6">
                Let&apos;s chat about what you need. No pressure, just a friendly conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {customerDashboardEnabled ? (
                  <>
                    <Link href="/start-project">
                      <LandingButton variant="primary" size="lg" className="gap-2">
                        Start a Project
                        <ArrowRight className="h-4 w-4" />
                      </LandingButton>
                    </Link>
                    <a href={SITE_CONFIG.calendly} target="_blank" rel="noopener noreferrer">
                      <LandingButton variant="secondary" size="lg" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Book a Call
                      </LandingButton>
                    </a>
                  </>
                ) : (
                  <Link href={CTA_CONFIG.dashboardDisabled.href}>
                    <LandingButton variant="primary" size="lg" className="gap-2">
                      {CTA_CONFIG.dashboardDisabled.text}
                      <ArrowRight className="h-4 w-4" />
                    </LandingButton>
                  </Link>
                )}
              </div>
            </div>
          </BlurFade>
        </div>
      </main>

      {/* Mobile Floating Footer - matches landing page style */}
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
            <div className="flex items-center p-2 bg-white/70 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <Link href="/contact" className="flex-1">
                <LandingButton variant="primary" className="w-full gap-2">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </LandingButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
