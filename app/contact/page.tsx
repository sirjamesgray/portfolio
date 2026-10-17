"use client";

import { FileText, Mail, Linkedin } from "lucide-react";
import { SectionHead } from "@/components/section-head";
import { CareerShell } from "@/components/career-shell";
import { BlurFade } from "@/components/ui/blur-fade";
import { RESUME_PATH, SITE_CONFIG, SOCIALS } from "@/lib/constants";
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
    title: "Download resume",
    icon: FileText,
    href: RESUME_PATH,
    external: false,
    primary: false,
  },
  {
    title: `Email ${SITE_CONFIG.email}`,
    icon: Mail,
    href: `mailto:${SITE_CONFIG.email}`,
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
    <CareerShell width="max-w-3xl">
      <div>
        <div className="mx-auto max-w-3xl">
          <BlurFade delay={0.1}>
            <div className="mb-8">
              <SectionHead index="05" title="Contact" as="h1" />
              <p className="mt-4 max-w-xl text-base text-muted-foreground">
                I&apos;d love to hear from you. Fort Worth, remote or DFW. Email or LinkedIn.
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
              Based in Fort Worth. Remote or DFW.
            </p>
          </BlurFade>
        </div>
      </div>
    </CareerShell>
  );
}
