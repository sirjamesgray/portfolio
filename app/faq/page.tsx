import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingButton } from "@/components/ui/landing-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { SiteHeader } from "@/components/site-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
      <SiteHeader variant="back" backHref="/" backLabel="Home" customerDashboardEnabled={dashboardEnabled} />

      <main className="flex-1 pt-20 pb-16">
        <div className="mx-auto max-w-3xl px-6">
          {/* Header */}
          <BlurFade delay={0.1}>
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
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`} className="px-6 border-b border-border last:border-b-0">
                      <AccordionTrigger className="text-foreground font-semibold text-lg text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
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
