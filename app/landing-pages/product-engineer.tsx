"use client";

import { useState } from "react";
import { ArrowRight, Code, Check, GitBranch, Layers, Zap, Users, Target, Mail, LucideIcon, AlertTriangle, Lightbulb, Wrench, Palette, Building2, RefreshCcw, FileX, GitFork, Shield, Unplug, Rocket, Blocks, FileCode, Database, ShieldCheck, Clock, MessageSquare } from "lucide-react";
import Image from "next/image";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { LandingButton } from "@/components/ui/landing-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeader } from "@/components/ui/section-header";
import { SiteHeader } from "@/components/site-header";
import { CursorGrid } from "@/components/cursor-grid";
import { Footer } from "@/components/footer";
import { DesignSystemsSection } from "@/components/design-systems-section";
import { ProjectsSection } from "@/components/projects-section";
import { CARD_INTERACTIVE_SOLID, CARD_FEATURED } from "@/lib/cards";
import { PRODUCT_ENGINEER_CTA, EXPERIENCE } from "@/lib/constants";
import { Marquee } from "@/components/ui/marquee";
import { UIShowcase, type ShowcaseStyle } from "@/components/ui-showcase";
import { UIStyleSwitcher } from "@/components/ui-style-switcher";
import { FeatureCard } from "@/components/ui/feature-card";
import { SectionCopyLink } from "@/components/ui/section-copy-link";
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
const problems: { Icon: LucideIcon; title: string; description: string }[] = [
  { Icon: RefreshCcw, title: "Rebuild from Scratch", description: "Designers iterate in Figma while engineers rebuild from scratch" },
  { Icon: FileX, title: "Lost in Translation", description: "Details get lost in translation, microinteractions get cut" },
  { Icon: GitFork, title: "System Drift", description: "Design systems drift from implementation" },
  { Icon: Shield, title: "QA as Last Defense", description: "QA becomes the last line of defense for UI consistency" },
  { Icon: Unplug, title: "Disconnected Workflow", description: "Iteration slows because design and code are disconnected" },
  { Icon: Clock, title: "Wasted Cycles", description: "Same components get rebuilt across teams, nobody owns the source of truth" },
];

// Approach items
const approaches: { Icon: LucideIcon; title: string; description: string }[] = [
  { Icon: Rocket, title: "Real Code Prototypes", description: "Rapid prototyping with real working code, rather than Figma prototypes" },
  { Icon: Blocks, title: "React-Native Design System", description: "Design system built directly in React" },
  { Icon: FileCode, title: "Components as Spec", description: "Components are the spec, not screenshots" },
  { Icon: Database, title: "Tokens in Code", description: "Tokens, spacing, typography, motion live in code" },
  { Icon: ShieldCheck, title: "System-Enforced Consistency", description: "UI consistency enforced by the system, not QA" },
  { Icon: MessageSquare, title: "Instant Feedback", description: "Stakeholders review live UI, not static mockups—feedback is immediate and actionable" },
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
    <div id="top" className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30">
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
              <LandingButton
                variant="secondary"
                className="text-base font-semibold"
                onClick={() => {
                  // Find the first section with an id after the hero (scroll-mt-20 marks content sections)
                  const sections = document.querySelectorAll("section[id].scroll-mt-20");
                  if (sections.length > 0) {
                    sections[0].scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  {PRODUCT_ENGINEER_CTA.secondary.text}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </LandingButton>
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
      <section id="problem" className="group relative px-6 py-16 scroll-mt-20">
        <SectionCopyLink sectionId="problem" className="absolute top-4 right-4" />
        <div className={`mx-auto ${SECTION_MAX_WIDTH}`}>
          <BlurFade delay={0.1} inView>
            <SectionHeader
              icon={AlertTriangle}
              iconVariant="red"
              title="The Problem"
              subtitle="Most teams have the same inefficiencies."
            />
          </BlurFade>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((item, idx) => (
              <BlurFade key={idx} delay={0.2 + idx * 0.05} inView>
                <FeatureCard
                  icon={item.Icon}
                  title={item.title}
                  description={item.description}
                  variant="red"
                />
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* My Approach Section */}
      <section id="approach" className="group relative px-6 py-16 scroll-mt-20">
        <SectionCopyLink sectionId="approach" className="absolute top-4 right-4" />
        <div className={`mx-auto ${SECTION_MAX_WIDTH}`}>
          <BlurFade delay={0.1} inView>
            <SectionHeader
              icon={Lightbulb}
              iconVariant="emerald"
              title="My Approach"
              subtitle="I delete the handoff. Design and code live together, always."
            />
          </BlurFade>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {approaches.map((item, idx) => (
              <BlurFade key={idx} delay={0.2 + idx * 0.05} inView>
                <FeatureCard
                  icon={item.Icon}
                  title={item.title}
                  description={item.description}
                  variant="emerald"
                />
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* UI Showcase Section - Scaffolding Flexibility */}
      <section id="showcase" className="group relative py-16 overflow-hidden scroll-mt-20">
        <SectionCopyLink sectionId="showcase" className="absolute top-4 right-4" />
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

      {/* Design Systems I've Built */}
      <DesignSystemsSection />

      {/* Projects I've Built */}
      <ProjectsSection />

      {/* Who This Is For Section */}
      <section id="audience" className="group relative px-6 py-16 scroll-mt-20">
        <SectionCopyLink sectionId="audience" className="absolute top-4 right-4" />
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
      <section id="experience" className="group/section relative py-16 overflow-hidden scroll-mt-20">
        <SectionCopyLink sectionId="experience" className="absolute top-4 right-4 group-hover/section:opacity-100" />
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
      <section id="contact" className="group relative px-6 py-16 scroll-mt-20">
        <SectionCopyLink sectionId="contact" className="absolute top-4 right-4" />
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
