import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { SiteHeader } from "@/components/site-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "FAQ | Jamie Gray",
  description: "Answers to common questions about working together on your website project.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="back" backHref="/" backLabel="Home" />

      <main className="pt-20 pb-16">
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
            <div className="rounded-xl border border-border bg-card/50">
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
          </BlurFade>

          {/* CTA */}
          <BlurFade delay={0.3}>
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-6">
                Still have questions? Let&apos;s chat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/start-project">
                  <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                    Start a Project
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="gap-2">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </BlurFade>
        </div>
      </main>
    </div>
  );
}
