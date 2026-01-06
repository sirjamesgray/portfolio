"use client";

import { ArrowRight, ArrowUp, Layers, Palette, Code2, Sparkles, Mail, Github, Key, Settings2, HeartHandshake, RefreshCw, Check, LucideIcon } from "lucide-react";
import { Glow } from "@codaworks/react-glow";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { SiteHeader } from "@/components/site-header";
import { UIShowcase } from "@/components/ui-showcase";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { CursorGrid } from "@/components/cursor-grid";
import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import 3D logo to avoid SSR issues
const Logo3D = dynamic(
  () => import("@/components/logo-3d").then((mod) => mod.Logo3D),
  { ssr: false }
);

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
    name: "Websites That Work",
    description:
      "Clean, fast websites that look great on any device. No templates—custom built for your business.",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
    ),
    className: "lg:col-span-2 lg:row-span-1",
  },
  {
    Icon: Palette,
    name: "Simple & Friendly Design",
    description:
      "Designs that your customers will actually enjoy using. Clear, intuitive, and easy to navigate.",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
    ),
    className: "lg:col-span-1 lg:row-span-1",
  },
  {
    Icon: Code2,
    name: "Built to Last",
    description:
      "Solid code that won't break. I handle everything from design to launch so you can focus on your business.",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent" />
    ),
    className: "lg:col-span-1 lg:row-span-1",
  },
  {
    Icon: Sparkles,
    name: "Admin Tools & Dashboards",
    description:
      "Custom tools to run your business better. Track customers, manage orders, see what's working—all in one place.",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
    ),
    className: "lg:col-span-2 lg:row-span-1",
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

export default function Home() {
  return (
    <div id="top" className="relative min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30">
      {/* Twinkling grid background */}
      <CursorGrid />

      {/* Header with login/signup */}
      <SiteHeader />

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
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                Jamie Gray
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              I build{" "}
              <span className="font-semibold text-foreground">
                websites
              </span>
               {" "} and {" "}
              <span className="font-semibold text-foreground">
                admin tools
              </span>
              {" "}for small businesses. Simple, reliable software that helps you work smarter and grow faster.
            </p>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Glow color="hsl(145, 80%, 45%)">
                <Link href="/start-project">
                  <ShimmerButton className="text-base font-semibold glow:ring-2 glow:ring-emerald-500/50">
                    <span className="flex items-center gap-2">
                      Start a Project
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </ShimmerButton>
                </Link>
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
                How I Can Help
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                I take care of the tech so you can focus on running your business.
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
            <Glow color="hsl(145, 80%, 45%)">
              <div className="rounded-2xl border border-white/10 bg-card/40 p-8 backdrop-blur-xl glow:ring-1 glow:ring-emerald-500/20 glow:border-emerald-500/40 sm:p-10">
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
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-500" />
                            <h3 className="font-semibold text-foreground">
                              {deliverable.name}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {deliverable.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Glow>
          </BlurFade>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <BlurFade delay={0.1} inView>
            <Glow color="hsl(145, 80%, 45%)">
              <div className="rounded-2xl border border-white/10 bg-card/60 p-8 text-center backdrop-blur-xl glow:ring-1 glow:ring-emerald-500/30 glow:border-emerald-500/40 sm:p-12">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Ready to get started?
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Tell me about your project and I&apos;ll get back to you within 24 hours. No pressure, no commitment.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/start-project">
                    <ShimmerButton
                      shimmerColor="#34d399"
                      background="linear-gradient(135deg, #059669 0%, #10b981 100%)"
                      className="text-lg font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        Start a Project
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </ShimmerButton>
                  </Link>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-base font-medium text-foreground backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
                  >
                    <Mail className="h-5 w-5" />
                    Email Directly
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
