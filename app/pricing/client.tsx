"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Check, X, Zap, Rocket, Ship, ArrowRight, Calendar, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { SiteHeader } from "@/components/site-header";
import { SITE_CONFIG } from "@/lib/constants";

const projects = [
  {
    value: "1-week-mvp",
    name: "1-Week Starter",
    price: "$2,500",
    description: "Get something live quickly",
    icon: Zap,
    features: [
      "Simple website or landing page",
      "Clean, professional design",
      "Mobile-friendly",
      "Live on the internet",
    ],
    ideal: "Testing a new idea",
  },
  {
    value: "2-week-build",
    name: "2-Week Standard",
    price: "$5,000",
    description: "A complete, polished website",
    icon: Rocket,
    features: [
      "Full website with multiple pages",
      "Custom design to match your brand",
      "Contact forms & user accounts",
      "Live on the internet",
    ],
    ideal: "Most small businesses",
    popular: true,
  },
  {
    value: "3-week-ship",
    name: "3-Week Premium",
    price: "$9,000",
    description: "For bigger, more complex needs",
    icon: Ship,
    features: [
      "Advanced features & functionality",
      "Connect to other tools you use",
      "Admin area to manage your site",
      "Speed & performance tuning",
      "Live on the internet",
    ],
    ideal: "Growing businesses",
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

      <main className="pt-20 pb-16">
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

                    <ul className="space-y-3 mb-6">
                      {project.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="text-sm text-muted-foreground mb-6">
                      <span className="font-medium">Best for:</span> {project.ideal}
                    </p>

                    <Link href={`/start-project?sprint=${project.value}`}>
                      <Button
                        className={`w-full gap-2 ${
                          project.popular
                            ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                            : ""
                        }`}
                        variant={project.popular ? "default" : "outline"}
                      >
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
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
                      <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Optional Add-ons */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
                <h3 className="text-lg font-semibold text-foreground text-center">
                  Optional Add-ons
                </h3>
                <div className="border-b border-amber-500/30 my-4" />
                <ul className="space-y-3">
                  {optional.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Plus className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
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

          {/* CTA */}
          <BlurFade delay={0.5}>
            <div className="text-center">
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
                      <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                        Start a Project
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <a href={SITE_CONFIG.calendly} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Book a Call
                      </Button>
                    </a>
                  </>
                ) : (
                  <a href={SITE_CONFIG.calendly} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                      <Calendar className="h-4 w-4" />
                      Book a Call
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </BlurFade>
        </div>
      </main>
    </div>
  );
}
