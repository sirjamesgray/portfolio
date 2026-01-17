"use client";

import { Mail, Linkedin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { BlurFade } from "@/components/ui/blur-fade";
import { SITE_CONFIG, SOCIALS } from "@/lib/constants";
import { Footer } from "@/components/footer";
import { LandingBackground } from "@/components/landing-background";
import { ActionLinkCard } from "@/components/ui/action-link-card";

const contactOptions = [
  {
    title: "Email me",
    icon: Mail,
    href: `mailto:${SITE_CONFIG.email}?subject=Let's%20Chat`,
    external: false,
    primary: true,
  },
  {
    title: "Connect on LinkedIn",
    icon: Linkedin,
    href: SOCIALS.linkedin,
    external: true,
    primary: false,
  },
];

export default function JoinTeamPage() {
  return (
    <LandingBackground className="flex flex-col">
      <SiteHeader landingPage="product-engineer" />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-3xl mx-auto px-4">
          <BlurFade delay={0.1}>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                I&apos;d love to hear from you!
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Looking for a Product Engineer who can own your design system? Let&apos;s chat and see if we&apos;re a good fit.
              </p>
            </div>
          </BlurFade>

          <div className="grid gap-4">
            {contactOptions.map((option, index) => (
              <BlurFade key={option.title} delay={0.15 + index * 0.05}>
                <ActionLinkCard
                  title={option.title}
                  icon={option.icon}
                  href={option.href}
                  external={option.external}
                  primary={option.primary}
                />
              </BlurFade>
            ))}
          </div>

          <BlurFade delay={0.3}>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Based in Dallas, TX. Open to remote or hybrid roles.
            </p>
          </BlurFade>
        </div>
      </main>

      <Footer />
    </LandingBackground>
  );
}
