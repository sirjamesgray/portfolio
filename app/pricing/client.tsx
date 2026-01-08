"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Check, X, Zap, Rocket, Ship, ArrowRight, Calendar, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { SiteHeader } from "@/components/site-header";
import { SITE_CONFIG } from "@/lib/constants";

const sprints = [
  {
    value: "1-week-mvp",
    name: "1-Week MVP Sprint",
    price: "$2,500",
    description: "Ship a working prototype fast",
    icon: Zap,
    features: [
      "Landing page or simple app",
      "Core functionality only",
      "Basic styling",
      "Deployed & live",
    ],
    ideal: "Validating an idea quickly",
  },
  {
    value: "2-week-build",
    name: "2-Week Build Sprint",
    price: "$5,000",
    description: "Build something more complete",
    icon: Rocket,
    features: [
      "Full-featured app or website",
      "Custom design implementation",
      "Database & authentication",
      "Deployed & live",
    ],
    ideal: "Launching a real product",
    popular: true,
  },
  {
    value: "3-week-ship",
    name: "3-Week Ship Sprint",
    price: "$9,000",
    description: "Ship something ambitious",
    icon: Ship,
    features: [
      "Complex functionality",
      "Integrations & APIs",
      "Admin dashboard",
      "Performance optimization",
      "Deployed & live",
    ],
    ideal: "Comprehensive builds",
  },
];

const included = [
  "Daily async updates",
  "Source code ownership",
  "Deployment setup",
  "1 week of bug fixes post-launch",
];

const optional = [
  "Content writing",
  "SEO optimization",
];

const notIncluded = [
  "Ongoing maintenance (available as retainer)",
  "Marketing strategy",
];

export function PricingPageClient() {
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
                Sprint Packages
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Fixed-price sprints. Ship fast. No surprises.
              </p>
            </div>
          </BlurFade>

          {/* Sprint Cards */}
          <BlurFade delay={0.2}>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {sprints.map((sprint) => {
                const Icon = sprint.icon;
                return (
                  <div
                    key={sprint.value}
                    id={sprint.value}
                    ref={(el) => {
                      if (el) cardRefs.current.set(sprint.value, el);
                    }}
                    className={`relative rounded-2xl border p-6 transition-all ${
                      sprint.popular
                        ? "border-emerald-500 dark:border-emerald-400 bg-emerald-500/5"
                        : "border-border bg-card/50"
                    }`}
                  >
                    {sprint.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        sprint.popular
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{sprint.name}</h3>
                        <p className="text-sm text-muted-foreground">{sprint.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">{sprint.price}</span>
                      <span className="text-muted-foreground ml-1">/ sprint</span>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {sprint.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="text-sm text-muted-foreground mb-6">
                      <span className="font-medium">Ideal for:</span> {sprint.ideal}
                    </p>

                    <Link href={`/start-project?sprint=${sprint.value}`}>
                      <Button
                        className={`w-full gap-2 ${
                          sprint.popular
                            ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                            : ""
                        }`}
                        variant={sprint.popular ? "default" : "outline"}
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
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  What&apos;s Included
                </h3>
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
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  Optional Add-ons
                </h3>
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
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <X className="h-5 w-5 text-muted-foreground" />
                  Not Included
                </h3>
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

          {/* Retainer Section */}
          <BlurFade delay={0.4}>
            <div className="rounded-2xl border border-border bg-card/50 p-8 text-center mb-16">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <RefreshCw className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Need Ongoing Support?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                After your sprint, I offer monthly retainers for maintenance, new features, and technical support.
                We&apos;ll discuss what makes sense for your project on our call.
              </p>
              <p className="text-sm text-muted-foreground">
                Retainers start at <span className="font-medium text-foreground">$1,500/month</span>
              </p>
            </div>
          </BlurFade>

          {/* CTA */}
          <BlurFade delay={0.5}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to ship?
              </h2>
              <p className="text-muted-foreground mb-6">
                Let&apos;s hop on a quick call to discuss your project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              </div>
            </div>
          </BlurFade>
        </div>
      </main>
    </div>
  );
}
