"use client";

import { Mail, Linkedin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { BlurFade } from "@/components/ui/blur-fade";
import { SITE_CONFIG, SOCIALS } from "@/lib/constants";
import { Footer } from "@/components/footer";
import { LandingBackground } from "@/components/landing-background";
import { ActionLinkCard } from "@/components/ui/action-link-card";

// X (formerly Twitter) logo
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
  {
    title: "Connect on X",
    icon: XIcon,
    href: SOCIALS.x,
    external: true,
    primary: false,
  },
];

export default function ContactPage() {
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
