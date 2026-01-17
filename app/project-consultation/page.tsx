"use client";

import { Calendar, Mail, MessageSquare } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { BlurFade } from "@/components/ui/blur-fade";
import { SITE_CONFIG } from "@/lib/constants";
import { Footer } from "@/components/footer";
import { LandingBackground } from "@/components/landing-background";
import { ActionLinkCard } from "@/components/ui/action-link-card";

const contactOptions = [
  {
    title: "Schedule a call",
    description: "Book a free 30-minute consultation to discuss your project",
    icon: Calendar,
    href: SITE_CONFIG.calendly,
    external: true,
    primary: true,
  },
  {
    title: "Email me",
    description: "Send me an email and I'll get back to you within 24 hours",
    icon: Mail,
    href: `mailto:${SITE_CONFIG.email}`,
    external: false,
    primary: false,
  },
  {
    title: "Text me",
    description: "Send a quick text message for fast responses",
    icon: MessageSquare,
    href: `sms:${SITE_CONFIG.phone}`,
    external: false,
    primary: false,
  },
];

export default function ContactPage() {
  return (
    <LandingBackground className="flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-3xl mx-auto px-4">
          <BlurFade delay={0.1}>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Let&apos;s work together
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Choose how you&apos;d like to get in touch. I typically respond within a few hours.
              </p>
            </div>
          </BlurFade>

          <div className="grid gap-4">
            {contactOptions.map((option, index) => (
              <BlurFade key={option.title} delay={0.15 + index * 0.05}>
                <ActionLinkCard
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  href={option.href}
                  external={option.external}
                  primary={option.primary}
                />
              </BlurFade>
            ))}
          </div>

          <BlurFade delay={0.35}>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Based in Dallas, TX. Available for remote work worldwide.
            </p>
          </BlurFade>
        </div>
      </main>

      <Footer />
    </LandingBackground>
  );
}
