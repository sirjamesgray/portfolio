"use client";

import { useState } from "react";
import { ArrowRight, Code, X, Check, GitBranch, Layers, Zap, Users, Target, Mail, LucideIcon, AlertTriangle, Lightbulb, Wrench, Heart, Palette, Briefcase, Building2 } from "lucide-react";
import Image from "next/image";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { LandingButton } from "@/components/ui/landing-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeader } from "@/components/ui/section-header";
import { SiteHeader } from "@/components/site-header";
import { CursorGrid } from "@/components/cursor-grid";
import { Footer } from "@/components/footer";
import { DesignSystemsSection } from "@/components/design-systems-section";
import { CARD_INTERACTIVE_SOLID, CARD_FEATURED, CARD_DESTRUCTIVE, CARD_WARNING } from "@/lib/cards";
import { PRODUCT_ENGINEER_CTA, EXPERIENCE } from "@/lib/constants";
import { Marquee } from "@/components/ui/marquee";
import { CrossedCornersCard } from "@/components/ui/crossed-corners-card";
import { UIShowcase, type ShowcaseStyle } from "@/components/ui-showcase";
import { UIStyleSwitcher } from "@/components/ui-style-switcher";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import 3D logo to avoid SSR issues
const Logo3D = dynamic(
  () => import("@/components/logo-3d").then((mod) => mod.Logo3D),
  { ssr: false }
);

// Max width for content sections
const SECTION_MAX_WIDTH = "max-w-4xl";

// Problem items - inefficiencies in the design-to-code workflow
const problems = [
  "Designers iterate in Figma while engineers rebuild from scratch",
  "Details get lost in translation, microinteractions get cut",
  "Design systems drift from implementation",
  "QA becomes the last line of defense for UI consistency",
  "Iteration slows because design and code are disconnected",
];

// Approach items
const approaches = [
  "Rapid prototyping with real working code, rather than Figma prototypes",
  "Design system built directly in React",
  "Components are the spec, not screenshots",
  "Tokens, spacing, typography, motion live in code",
  "UI consistency enforced by the system, not QA",
];

// Working principles - philosophy and approach
const workingPrinciples: { Icon: LucideIcon; title: string; description: string }[] = [
  {
    Icon: Layers,
    title: "Code Is the Source of Truth",
    description: "The component library is the design system. No Figma files to maintain, no drift between spec and reality.",
  },
  {
    Icon: GitBranch,
    title: "One System, Zero Fragmentation",
    description: "Tokens, spacing, typography, motion—all in version control. One change updates everywhere.",
  },
  {
    Icon: Code,
    title: "Real UI, Not Screenshots",
    description: "Stakeholders review live components. No more 'this looks different in production' conversations.",
  },
  {
    Icon: Zap,
    title: "Speed Through Precision",
    description: "Production-ready prototypes mean faster validation. Less rework, more shipping.",
  },
  {
    Icon: Users,
    title: "Engineers Stay Unblocked",
    description: "Missing component? It gets built and documented. The system serves velocity, not the other way around.",
  },
  {
    Icon: Target,
    title: "Correctness by Default",
    description: "Components work right out of the box. QA hunts logic bugs, not pixel mismatches.",
  },
];

// Why it works items
const benefits = [
  "No translation layer between design and code",
  "Feedback happens on real UI, not mockups",
  "Motion and edge cases are first-class citizens",
  "Engineers stop rebuilding the same components",
];

// Track record - what I've delivered on past teams
const trackRecord: { Icon: LucideIcon; title: string; description: string }[] = [
  { Icon: Layers, title: "Unified Design Systems", description: "Consolidated fragmented component libraries into single sources of truth" },
  { Icon: Check, title: "Dramatic Bug Reduction", description: "Made UI correctness the default, not the exception" },
  { Icon: Zap, title: "Zero Handoff Delays", description: "Eliminated the design-to-engineering translation layer entirely" },
  { Icon: Users, title: "True Cross-Functional Work", description: "Embedded with engineering, product, and design—not siloed" },
  { Icon: Code, title: "Production-First Design", description: "Shipped real components in PRs, not Figma comment threads" },
  { Icon: Target, title: "Self-Enforcing Standards", description: "Built systems that maintain consistency automatically" },
];

// Audience items - teams I want to join long-term
const audiences = [
  "Engineering-led teams tired of design–engineering friction",
  "Teams that want a designer who ships code, not mockups",
  "Teams that value velocity, consistency, and ownership",
  "Teams building products where the design system actually matters",
];

interface ProductEngineerLandingProps {
  customerDashboardEnabled?: boolean;
}

export function ProductEngineerLanding({ customerDashboardEnabled }: ProductEngineerLandingProps) {
  const [showcaseStyle, setShowcaseStyle] = useState<ShowcaseStyle>("paper");

  return (
    <div id="top" className="relative min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30">
      {/* Twinkling grid background */}
      <CursorGrid />

      {/* Header with "Let's talk" CTAs */}
      <SiteHeader landingPage="product-engineer" customerDashboardEnabled={customerDashboardEnabled} />

      {/* Hero Section - Simplified */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
        {/* Large 3D Logo Background */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-25">
          <Logo3D size="hero" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <BlurFade delay={0.1}>
            <p className="mb-6 text-sm font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Product Engineer
            </p>
          </BlurFade>

          <BlurFade delay={0.2}>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                Jamie Gray
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
              I&apos;m a designer who abandoned Figma. Now I design directly in front-end code,
              eliminating handoffs, speeding up iteration, and keeping design systems honest.
            </p>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={PRODUCT_ENGINEER_CTA.secondary.href}>
                <LandingButton variant="secondary" className="text-base font-semibold">
                  <span className="flex items-center gap-2">
                    {PRODUCT_ENGINEER_CTA.secondary.text}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </LandingButton>
              </Link>
              <Link href={PRODUCT_ENGINEER_CTA.primary.href}>
                <LandingButton variant="primary" className="text-base font-semibold">
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {PRODUCT_ENGINEER_CTA.primary.text}
                  </span>
                </LandingButton>
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="relative px-6 py-16">
        <div className={`mx-auto ${SECTION_MAX_WIDTH}`}>
          <BlurFade delay={0.1} inView>
            <SectionHeader
              icon={AlertTriangle}
              iconVariant="red"
              title="The Problem"
              subtitle="Most teams have the same inefficiencies."
            />
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <CursorGlow color="hsl(0, 85%, 55%)" disabledInLightMode={false}>
              <div className={`${CARD_DESTRUCTIVE.full} p-8`}>
                <ul className="space-y-4">
                  {problems.map((problem, idx) => (
                    <BlurFade key={idx} delay={0.25 + idx * 0.05} inView>
                      <li className="flex items-start gap-3 text-muted-foreground">
                        <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{problem}</span>
                      </li>
                    </BlurFade>
                  ))}
                </ul>
              </div>
            </CursorGlow>
          </BlurFade>
        </div>
      </section>

      {/* My Approach Section */}
      <section id="approach" className="relative px-6 py-16">
        <div className={`mx-auto ${SECTION_MAX_WIDTH}`}>
          <BlurFade delay={0.1} inView>
            <SectionHeader
              icon={Lightbulb}
              iconVariant="emerald"
              title="My Approach"
            >
              <p className="mx-auto max-w-xl text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-3">
                I delete the handoff. Design and code live together, always.
              </p>
            </SectionHeader>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <CursorGlow>
              <div className={`${CARD_FEATURED.base} ${CARD_FEATURED.shadow} p-8`}>
                <ul className="space-y-4">
                  {approaches.map((approach, idx) => (
                    <BlurFade key={idx} delay={0.25 + idx * 0.05} inView>
                      <li className="flex items-start gap-3 text-muted-foreground">
                        <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{approach}</span>
                      </li>
                    </BlurFade>
                  ))}
                </ul>
              </div>
            </CursorGlow>
          </BlurFade>
        </div>
      </section>

      {/* UI Showcase Section - Scaffolding Flexibility */}
      <section className="relative py-16 overflow-hidden">
        <div className={`mx-auto px-6 ${SECTION_MAX_WIDTH}`}>
          <BlurFade delay={0.1} inView>
            <SectionHeader
              icon={Palette}
              iconVariant="emerald"
              title="Strong Scaffolding, Maximum Flexibility"
              subtitle="The same semantic components render beautifully across any visual aesthetic. Visual redesigns become theme swaps, not rewrites."
            />
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <div className="flex justify-center mb-6">
              <UIStyleSwitcher activeStyle={showcaseStyle} onStyleChange={setShowcaseStyle} />
            </div>
          </BlurFade>
        </div>

        <BlurFade delay={0.3} inView>
          <UIShowcase style={showcaseStyle} />
        </BlurFade>
      </section>

      {/* What I Actually Do Section */}
      <section className="relative px-6 py-16">
        <div className={`mx-auto ${SECTION_MAX_WIDTH}`}>
          <BlurFade delay={0.1} inView>
            <SectionHeader
              icon={Wrench}
              iconVariant="emerald"
              title="How I Work"
              subtitle="Principles I've refined over 8 years of shipping design systems."
            />
          </BlurFade>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workingPrinciples.map((item, idx) => {
              const Icon = item.Icon;
              return (
                <BlurFade key={idx} delay={0.2 + idx * 0.05} inView>
                  <CursorGlow>
                    <div className={`${CARD_INTERACTIVE_SOLID.full} p-6 h-full`}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20 mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CursorGlow>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </section>

      {/* Design Systems I've Built */}
      <DesignSystemsSection />

      {/* Why This Works Section */}
      <section className="relative px-6 py-16">
        <div className={`mx-auto ${SECTION_MAX_WIDTH}`}>
          <BlurFade delay={0.1} inView>
            <SectionHeader
              icon={Zap}
              iconVariant="yellow"
              title="Why This Works"
              subtitle="Iteration speed increases when design and code are unified."
            />
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <CursorGlow color="hsl(45, 93%, 47%)">
              <div className={`${CARD_WARNING.full} p-8`}>
                <ul className="space-y-4">
                  {benefits.map((benefit, idx) => (
                    <BlurFade key={idx} delay={0.25 + idx * 0.05} inView>
                      <li className="flex items-start gap-3 text-foreground">
                        <Zap className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    </BlurFade>
                  ))}
                </ul>
              </div>
            </CursorGlow>
          </BlurFade>
        </div>
      </section>

      {/* What I Bring to Your Team Section */}
      <section className="relative px-6 py-16">
        <div className={`mx-auto ${SECTION_MAX_WIDTH}`}>
          <BlurFade delay={0.1} inView>
            <SectionHeader
              icon={Briefcase}
              iconVariant="emerald"
              title="What I Bring to Your Team"
              subtitle="What I've delivered on past teams."
            />
          </BlurFade>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trackRecord.map((item, idx) => {
              const Icon = item.Icon;
              return (
                <BlurFade key={idx} delay={0.2 + idx * 0.05} inView>
                  <CursorGlow>
                    <div className={`${CARD_INTERACTIVE_SOLID.full} p-5 flex items-start gap-4`}>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  </CursorGlow>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="relative px-6 py-16">
        <div className={`mx-auto ${SECTION_MAX_WIDTH}`}>
          <BlurFade delay={0.1} inView>
            <SectionHeader
              icon={Users}
              iconVariant="emerald"
              title="Who This Is For"
              subtitle="I'm looking to join:"
            />
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <CursorGlow>
              <div className={`${CARD_INTERACTIVE_SOLID.full} p-8`}>
                <ul className="space-y-4">
                  {audiences.map((audience, idx) => (
                    <BlurFade key={idx} delay={0.25 + idx * 0.05} inView>
                      <li className="flex items-start gap-3 text-muted-foreground">
                        <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{audience}</span>
                      </li>
                    </BlurFade>
                  ))}
                </ul>
              </div>
            </CursorGlow>
          </BlurFade>
        </div>
      </section>

      {/* Experience Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="mx-auto px-6 max-w-4xl">
          <BlurFade delay={0.1} inView>
            <SectionHeader
              icon={Building2}
              iconVariant="emerald"
              title="Experience"
              subtitle="Teams I've worked on in the past."
            />
          </BlurFade>
        </div>

        <BlurFade delay={0.2} inView>
          <Link href="/experience" className="block group">
            <Marquee pauseOnHover className="[--duration:30s]">
              {EXPERIENCE.map((exp, idx) => (
                <BlurFade key={exp.company} delay={0.25 + idx * 0.03} inView>
                  <div
                    className="flex items-center gap-3 pl-3 pr-6 py-3 rounded-lg bg-card/50 border border-border/50 group-hover:border-emerald-500/30 transition-colors"
                  >
                    <Image
                      src={exp.logo}
                      alt={exp.company}
                      width={32}
                      height={32}
                      className="rounded-md"
                    />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {exp.company}
                    </span>
                  </div>
                </BlurFade>
              ))}
            </Marquee>
          </Link>
        </BlurFade>
      </section>

      {/* CTA Section - Let's Talk Focus */}
      <section id="contact" className="relative px-6 py-16">
        <div className={`mx-auto ${SECTION_MAX_WIDTH}`}>
          <BlurFade delay={0.1} inView>
            <CursorGlow>
              <div className={`${CARD_FEATURED.base} ${CARD_FEATURED.shadow} p-8 text-center sm:p-12`}>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Let&apos;s Work Together
                </h2>
                <p className="mb-8 text-lg text-muted-foreground max-w-xl mx-auto">
                  I&apos;m currently looking for a full-time Product Engineer role where I can own the design system and ship UI that works. I&apos;d love to chat!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href={PRODUCT_ENGINEER_CTA.primary.href}>
                    <LandingButton variant="primary" size="lg">
                      <span className="flex items-center justify-center gap-2">
                        <Mail className="h-5 w-5" />
                        {PRODUCT_ENGINEER_CTA.primary.text}
                      </span>
                    </LandingButton>
                  </Link>
                </div>
              </div>
            </CursorGlow>
          </BlurFade>
        </div>
      </section>

      {/* Footer Tagline */}
      <section className="relative px-6 py-12">
        <BlurFade delay={0.1} inView>
          <p className="text-center text-sm text-muted-foreground">
            Design systems belong in <span className="font-mono text-emerald-600 dark:text-emerald-400">Git</span>, not Figma.
          </p>
        </BlurFade>
      </section>

      {/* Footer */}
      <div className="mb-24 md:mb-0">
        <Footer />
      </div>
    </div>
  );
}
