import { Calendar, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { BlurFade } from "@/components/ui/blur-fade";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: "Get in Touch | Jamie Gray",
  description: "Schedule a call, send an email, or text me directly to discuss your project.",
};

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
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background pt-24 pb-16">
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
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <BlurFade key={option.title} delay={0.15 + index * 0.05}>
                  <Link
                    href={option.href}
                    target={option.external ? "_blank" : undefined}
                    rel={option.external ? "noopener noreferrer" : undefined}
                    className={`group flex items-center gap-6 p-6 rounded-xl border transition-all ${
                      option.primary
                        ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
                        : "bg-card hover:bg-muted/50 border-border"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 p-3 rounded-lg ${
                        option.primary
                          ? "bg-white/20"
                          : "bg-emerald-500/10"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          option.primary ? "text-white" : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2
                        className={`text-lg font-semibold ${
                          option.primary ? "text-white" : "text-foreground"
                        }`}
                      >
                        {option.title}
                      </h2>
                      <p
                        className={`text-sm ${
                          option.primary ? "text-white/80" : "text-muted-foreground"
                        }`}
                      >
                        {option.description}
                      </p>
                    </div>
                    <div
                      className={`flex-shrink-0 transition-transform group-hover:translate-x-1 ${
                        option.primary ? "text-white/80" : "text-muted-foreground"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </div>
                  </Link>
                </BlurFade>
              );
            })}
          </div>

          <BlurFade delay={0.35}>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Based in Dallas, TX. Available for remote work worldwide.
            </p>
          </BlurFade>
        </div>
      </main>
    </>
  );
}
