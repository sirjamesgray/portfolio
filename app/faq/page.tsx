import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { LandingButton } from "@/components/ui/landing-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { SiteHeader } from "@/components/site-header";
import { FAQAccordion } from "@/components/faq-accordion";
import { faqs } from "@/lib/faq-data";
import { CTA_CONFIG } from "@/lib/constants";
import { isCustomerDashboardEnabled } from "@/lib/feature-flags";
import { CARD_INTERACTIVE_SOLID } from "@/lib/cards";
import { Footer } from "@/components/footer";
import { LandingBackground } from "@/components/landing-background";
import { CursorGlow } from "@/components/ui/cursor-glow";

export const metadata: Metadata = {
  title: "FAQ | Jamie Gray",
  description: "Answers to common questions about working together on your website project.",
};

export default async function FAQPage() {
  const dashboardEnabled = await isCustomerDashboardEnabled();
  const cta = dashboardEnabled ? CTA_CONFIG.dashboardEnabled : CTA_CONFIG.dashboardDisabled;

  return (
    <LandingBackground className="flex flex-col">
      <SiteHeader customerDashboardEnabled={dashboardEnabled} />

      <main className="flex-1 pt-20 pb-16">
        <div className="mx-auto max-w-3xl px-6">
          <BlurFade delay={0.1}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </BlurFade>

          {/* Header */}
          <BlurFade delay={0.15}>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about working together.
              </p>
            </div>
          </BlurFade>

          {/* FAQ List */}
          <BlurFade delay={0.2}>
            <CursorGlow>
              <div className={`${CARD_INTERACTIVE_SOLID.base} ${CARD_INTERACTIVE_SOLID.shadow} ${CARD_INTERACTIVE_SOLID.hover} bg-card/50`}>
                <FAQAccordion faqs={faqs} />
              </div>
            </CursorGlow>
          </BlurFade>

          {/* CTA */}
          <BlurFade delay={0.3}>
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-6">
                Still have questions? Let&apos;s chat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={cta.href}>
                  <LandingButton variant="primary" size="lg" className="gap-2">
                    {cta.text}
                    <ArrowRight className="h-4 w-4" />
                  </LandingButton>
                </Link>
                <Link href="/pricing">
                  <LandingButton variant="secondary" size="lg" className="gap-2">
                    View Pricing
                  </LandingButton>
                </Link>
              </div>
            </div>
          </BlurFade>
        </div>
      </main>

      <Footer />
    </LandingBackground>
  );
}
