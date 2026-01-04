"use client";

import { ArrowRight, Layers, Palette, Code2, Sparkles } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { CursorGrid } from "@/components/cursor-grid";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { ThemeToggle } from "@/components/theme-toggle";
import { UIShowcase } from "@/components/ui-showcase";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";

const services = [
  {
    Icon: Layers,
    name: "Production-Grade Prototyping",
    description:
      "Skip the throwaway mockups. I build prototypes with real code that evolve into your final product.",
    href: "#contact",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent" />
    ),
    className: "lg:col-span-2 lg:row-span-1",
  },
  {
    Icon: Palette,
    name: "UX-Led Systems Design",
    description:
      "Design systems that scale. 8 years of UX expertise translated into component architectures that teams actually want to use.",
    href: "#contact",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
    ),
    className: "lg:col-span-1 lg:row-span-1",
  },
  {
    Icon: Code2,
    name: "Full-Stack Development",
    description:
      "From Next.js to databases, I ship complete solutions. No handoff friction—design and code from the same mind.",
    href: "#contact",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent" />
    ),
    className: "lg:col-span-1 lg:row-span-1",
  },
  {
    Icon: Sparkles,
    name: "Client Software Solutions",
    description:
      "Custom software for your business. CRM, dashboards, internal tools—built to your exact specifications.",
    href: "#contact",
    cta: "Let's talk",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
    ),
    className: "lg:col-span-2 lg:row-span-1",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Header with theme toggle */}
      <header className="fixed top-0 right-0 z-50 p-4">
        <ThemeToggle />
      </header>

      <CursorGrid />

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <BlurFade delay={0.1}>
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Product Engineer
            </p>
          </BlurFade>

          <BlurFade delay={0.2}>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Jamie Gray
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              I turn complex ideas into elegant software. With{" "}
              <span className="font-semibold text-foreground">
                8 years of UX design experience
              </span>
              , I bridge the gap between design and engineering to build
              products that users love.
            </p>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#contact">
                <ShimmerButton className="text-base font-semibold">
                  <span className="flex items-center gap-2">
                    Work with me
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </ShimmerButton>
              </a>
              <a
                href="#services"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                See what I do
              </a>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Interactive UI Showcase */}
      <UIShowcase />

      {/* Experience Section */}
      <ExperienceTimeline />

      {/* Services Section */}
      <section id="services" className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <BlurFade delay={0.1} inView>
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                What I Do
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                End-to-end product engineering for teams who want design and
                development that actually work together.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <BentoGrid className="lg:grid-cols-3">
              {services.map((service, idx) => (
                <BentoCard key={idx} {...service} />
              ))}
            </BentoGrid>
          </BlurFade>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <BlurFade delay={0.1} inView>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to build something great?
            </h2>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <p className="mb-8 text-lg text-muted-foreground">
              Whether you need a new product, a design system, or help scaling
              your engineering team&apos;s output—let&apos;s talk about how I can help.
            </p>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <a href={`mailto:${SITE_CONFIG.email}`}>
              <ShimmerButton
                shimmerColor="#a855f7"
                background="linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)"
                className="text-lg font-semibold"
              >
                <span className="flex items-center gap-2">
                  Contact
                  <ArrowRight className="h-5 w-5" />
                </span>
              </ShimmerButton>
            </a>
          </BlurFade>

          <BlurFade delay={0.4} inView>
            <p className="mt-6 text-sm text-muted-foreground">
              Or email me directly at{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="font-medium text-foreground underline underline-offset-4"
              >
                {SITE_CONFIG.email}
              </a>
            </p>
          </BlurFade>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Jamie Gray. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
