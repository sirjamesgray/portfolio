"use client";

import { ArrowRight, ArrowUp, Layers, Palette, Code2, Sparkles } from "lucide-react";
import { Glow } from "@codaworks/react-glow";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { ThemeToggle } from "@/components/theme-toggle";
import { UIShowcase } from "@/components/ui-showcase";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { CursorGrid } from "@/components/cursor-grid";
import { SITE_CONFIG } from "@/lib/constants";

// Social links
const socials = [
  {
    name: "X",
    href: "https://x.com/jamiegraytech",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/jamiegraytech/",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const services = [
  {
    Icon: Layers,
    name: "Production-Grade Prototyping",
    description:
      "Skip the throwaway mockups. I build prototypes with real code that evolve into your final product.",
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
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
    ),
    className: "lg:col-span-2 lg:row-span-1",
  },
];

export default function Home() {
  return (
    <div id="top" className="relative min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30">
      {/* Twinkling grid background */}
      <CursorGrid />

      {/* Header with theme toggle */}
      <header className="fixed top-0 right-0 z-50 p-4">
        <ThemeToggle />
      </header>

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
              <Glow color="hsl(270, 80%, 60%)">
                <a href="#contact">
                  <ShimmerButton className="text-base font-semibold glow:ring-2 glow:ring-purple-500/50">
                    <span className="flex items-center gap-2">
                      Work with me
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </ShimmerButton>
                </a>
              </Glow>
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
        <div className="mx-auto max-w-3xl">
          <BlurFade delay={0.1} inView>
            <Glow color="hsl(270, 80%, 60%)">
              <div className="rounded-2xl border border-white/10 bg-card/60 p-8 text-center backdrop-blur-xl glow:ring-1 glow:ring-purple-500/30 glow:border-purple-500/40 sm:p-12">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Ready to build something great?
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Whether you need a new product, a design system, or help scaling
                  your engineering team&apos;s output—let&apos;s talk about how I can help.
                </p>
                <div className="flex justify-center">
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
                </div>
              </div>
            </Glow>
          </BlurFade>
        </div>
      </section>

      {/* Social Section */}
      <section className="relative px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <BlurFade delay={0.1} inView>
            <div className="flex flex-col items-center gap-6">
              <p className="text-sm font-medium text-muted-foreground">
                Connect with me
              </p>
              <div className="flex items-center gap-6">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Back to Top Button */}
      <div className="flex justify-center pb-8">
        <a
          href="#top"
          className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
          Back to top
        </a>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Jamie Gray. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
