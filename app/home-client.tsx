"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Github, Key, Settings2, HeartHandshake, RefreshCw, Check, LucideIcon, User, Share2, Copy, Zap, Rocket, Ship, Paintbrush } from "lucide-react";
import { UIShowcase, type ShowcaseStyle } from "@/components/ui-showcase";
import { UIStyleSwitcher } from "@/components/ui-style-switcher";
import { AnimatedHeight } from "@/components/ui/animated-height";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { LandingButton } from "@/components/ui/landing-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ProjectsShowcase } from "@/components/projects-showcase";
import { CursorGrid } from "@/components/cursor-grid";
import { Footer } from "@/components/footer";
import { SITE_CONFIG, CTA_CONFIG } from "@/lib/constants";
import { CARD_INTERACTIVE_SOLID, CARD_FEATURED } from "@/lib/cards";
import { CrossedCornersCard } from "@/components/ui/crossed-corners-card";
import { faqs } from "@/lib/faq-data";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Dynamically import 3D logo to avoid SSR issues
const Logo3D = dynamic(
  () => import("@/components/logo-3d").then((mod) => mod.Logo3D),
  { ssr: false }
);

const projectPricing = [
  {
    value: "1-week-mvp",
    name: "1-Week Starter",
    description: "Get something live quickly",
    icon: Zap,
  },
  {
    value: "2-week-build",
    name: "2-Week Standard",
    description: "A complete, polished website",
    icon: Rocket,
    popular: true,
  },
  {
    value: "3-week-ship",
    name: "3-Week Premium",
    description: "For bigger, more complex needs",
    icon: Ship,
  },
];

const deliverables: { Icon: LucideIcon; name: string; description: string }[] = [
  {
    Icon: Github,
    name: "You Own Everything",
    description: "All the code is yours. No monthly fees, no lock-in, no surprises.",
  },
  {
    Icon: Key,
    name: "All Your Logins",
    description: "Every password and account handed over. You're in full control.",
  },
  {
    Icon: Settings2,
    name: "Easy to Update",
    description: "Built so you (or anyone) can make changes later without starting over.",
  },
  {
    Icon: HeartHandshake,
    name: "Free Support",
    description: "Questions after launch? I've got you covered for the first few months.",
  },
  {
    Icon: RefreshCw,
    name: "Ongoing Help Available",
    description: "Need updates or new features down the road? I'm just a message away.",
  },
];

const ROTATING_WORDS = ["new", "fast", "beautiful", "modern", "custom"];

interface HomeClientProps {
  customerDashboardEnabled: boolean;
}

export function HomeClient({ customerDashboardEnabled }: HomeClientProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [copied, setCopied] = useState(false);
  const [showcaseStyle, setShowcaseStyle] = useState<ShowcaseStyle>("neon");

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = SITE_CONFIG.url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Jamie Gray - Product Engineer",
          text: "Check out Jamie Gray's portfolio - custom websites and web apps for small businesses",
          url: SITE_CONFIG.url,
        });
      } catch {
        // User cancelled or share failed, fall back to copy
        handleCopyUrl();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopyUrl();
    }
  };

  useEffect(() => {
    // Only check user if dashboard is enabled
    if (!customerDashboardEnabled) return;

    async function checkUser() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch {
        setUser(null);
      }
    }
    checkUser();
  }, [customerDashboardEnabled]);

  // When dashboard is disabled, always show Calendly flow (no user state)
  const showDashboardLinks = customerDashboardEnabled && user;

  return (
    <div id="top" className="relative min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30">
      {/* Twinkling grid background */}
      <CursorGrid />

      {/* Header with login/signup */}
      <SiteHeader customerDashboardEnabled={customerDashboardEnabled} />

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
        {/* Large 3D Logo Background */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-25">
          <Logo3D size="hero" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <BlurFade delay={0.1}>
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Product Engineer
            </p>
          </BlurFade>

          <BlurFade delay={0.2}>
            <AnimatedHeight className="mb-6">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Need a{" "}
                <ContainerTextFlip
                  words={ROTATING_WORDS}
                  interval={2500}
                  textClassName="font-bold"
                />
                {" "}website?
              </h1>
            </AnimatedHeight>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Hi, I&apos;m Jamie Gray. I build{" "}
              <span className="font-semibold text-foreground">
                websites
              </span>
               {" "}and{" "}
              <span className="font-semibold text-foreground">
                admin tools
              </span>
              {" "}for small businesses. Simple, reliable software that helps you work smarter and grow faster.
            </p>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {showDashboardLinks ? (
                <Link href="/dashboard">
                  <LandingButton variant="secondary" className="text-base font-semibold">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      View Dashboard
                    </span>
                  </LandingButton>
                </Link>
              ) : (
                <Link href="/pricing">
                  <LandingButton variant="secondary" className="text-base font-semibold">
                    <span className="flex items-center gap-2">
                      View pricing
                    </span>
                  </LandingButton>
                </Link>
              )}
              {customerDashboardEnabled ? (
                <Link href="/start-project">
                  <LandingButton variant="primary" className="text-base font-semibold ">
                    <span className="flex items-center gap-2">
                      {showDashboardLinks ? "Start New Project" : "Start a Project"}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </LandingButton>
                </Link>
              ) : (
                <Link href={CTA_CONFIG.dashboardDisabled.href}>
                  <LandingButton variant="primary" className="text-base font-semibold ">
                    <span className="flex items-center gap-2">
                      {CTA_CONFIG.dashboardDisabled.text}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </LandingButton>
                </Link>
              )}
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Projects Section */}
      <ProjectsShowcase />

      {/* Pricing Teaser Section */}
      <section id="pricing" className="relative px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <BlurFade delay={0.1} inView>
            <div className="mb-10 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Simple Pricing
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Transparent pricing. No hidden fees. Know what you&apos;re paying upfront.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <div className="grid gap-4 sm:grid-cols-3">
              {projectPricing.map((project) => {
                const Icon = project.icon;
                return (
                  <CursorGlow key={project.value}>
                    <Link
                      href={`/pricing#${project.value}`}
                      className={`group relative flex items-center gap-4 p-5 ${
                        project.popular
                          ? `${CARD_FEATURED.base} ${CARD_FEATURED.shadow} ${CARD_FEATURED.hover}`
                          : `${CARD_INTERACTIVE_SOLID.base} ${CARD_INTERACTIVE_SOLID.shadow} ${CARD_INTERACTIVE_SOLID.hover}`
                      }`}
                    >
                      {project.popular && (
                        <div className="absolute -top-2.5 left-4">
                          <span className="bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        </div>
                      )}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        project.popular
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground group-hover:bg-emerald-500/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                      } transition-colors`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0" />
                    </Link>
                  </CursorGlow>
                );
              })}
            </div>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <div className="mt-8 flex justify-center">
              <Link href="/pricing">
                <LandingButton variant="primary" className="gap-2">
                  View Pricing & Get Started
                  <ArrowRight className="h-4 w-4" />
                </LandingButton>
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Custom Styles Section */}
      <section id="styles" className="relative py-24 overflow-hidden">
        <BlurFade delay={0.1} inView>
          <div className="mb-8 text-center px-6">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                <Paintbrush className="h-6 w-6" />
              </div>
            </div>
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Custom Styles
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Every site is tailored to match your brand. Pick a style that fits your vibe,
              or I&apos;ll create something completely unique for you.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="mb-6 px-6">
            <UIStyleSwitcher activeStyle={showcaseStyle} onStyleChange={setShowcaseStyle} />
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <UIShowcase style={showcaseStyle} />
        </BlurFade>
      </section>

      {/* Experience Section */}
      <ExperienceTimeline />

      {/* What You Get Section */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <BlurFade delay={0.1} inView>
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                What You Get
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                No hidden fees, no complicated contracts. Just straightforward work and complete ownership.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <CursorGlow>
              <div className={`${CARD_INTERACTIVE_SOLID.base} ${CARD_INTERACTIVE_SOLID.shadow} ${CARD_INTERACTIVE_SOLID.hover} p-8 sm:p-10`}>
                <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
                  {deliverables.map((deliverable, idx) => {
                    const Icon = deliverable.Icon;
                    return (
                      <div
                        key={idx}
                        className="group flex items-start gap-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20 transition-all group-hover:bg-emerald-500/20 group-hover:ring-emerald-500/40">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">
                            {deliverable.name}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {deliverable.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CursorGlow>
          </BlurFade>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <BlurFade delay={0.1} inView>
            <div className="mb-10 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Questions?
              </h2>
              <p className="text-muted-foreground">
                Quick answers to common questions.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <CursorGlow>
              <div className={`${CARD_INTERACTIVE_SOLID.base} ${CARD_INTERACTIVE_SOLID.shadow} ${CARD_INTERACTIVE_SOLID.hover} bg-card/50 `}>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.slice(0, 3).map((faq, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`} className="px-5 border-b border-border last:border-b-0">
                      <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CursorGlow>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <div className="mt-6 text-center">
              <Link
                href="/faq"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                View all FAQs <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Referral Section */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <BlurFade delay={0.1} inView>
            <CrossedCornersCard className="p-8 text-center sm:p-12">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Know someone?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Maybe you don&apos;t need a site yourself, but you know someone else who might? Please share this site with them!
              </p>
              <div className="flex flex-col sm:flex-row items-stretch gap-4 max-w-md mx-auto">
                <LandingButton
                  variant="primary"
                  size="lg"
                  onClick={handleShare}
                  className="flex-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Share this site
                  </span>
                </LandingButton>
                <LandingButton
                  variant="secondary"
                  size="lg"
                  onClick={handleCopyUrl}
                  className="flex-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    {copied ? (
                      <>
                        <Check className="h-5 w-5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" />
                        Copy URL
                      </>
                    )}
                  </span>
                </LandingButton>
              </div>
            </CrossedCornersCard>
          </BlurFade>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <BlurFade delay={0.1} inView>
            <CursorGlow>
              <div className={`${CARD_INTERACTIVE_SOLID.full} p-8 text-center sm:p-12`}>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Ready to get started?
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Tell me about your project and I&apos;ll get back to you within 24 hours. No pressure, no commitment.
                </p>
                {customerDashboardEnabled ? (
                  <Link href="/start-project">
                    <LandingButton variant="primary" size="lg">
                      <span className="flex items-center justify-center gap-2">
                        Let&apos;s go!
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </LandingButton>
                  </Link>
                ) : (
                  <Link href={CTA_CONFIG.dashboardDisabled.href}>
                    <LandingButton variant="primary" size="lg">
                      <span className="flex items-center justify-center gap-2">
                        Let&apos;s go!
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </LandingButton>
                  </Link>
                )}
              </div>
            </CursorGlow>
          </BlurFade>
        </div>
      </section>

      {/* Footer */}
      <div className="mb-24 md:mb-0">
        <Footer />
      </div>
    </div>
  );
}
