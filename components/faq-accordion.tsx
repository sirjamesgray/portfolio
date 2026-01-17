"use client";

import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
  className?: string;
}

export function FAQAccordion({ faqs, className }: FAQAccordionProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch with Radix components that generate random IDs
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR placeholder - just show questions without Radix
    return (
      <div className="w-full">
        {faqs.map((faq, idx) => (
          <div key={idx} className={`px-6 py-4 border-b border-border last:border-b-0 ${className}`}>
            <div className="text-foreground font-semibold text-lg">{faq.question}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, idx) => (
        <AccordionItem key={idx} value={`faq-${idx}`} className={`px-6 border-b border-border last:border-b-0 ${className}`}>
          <AccordionTrigger className="text-foreground font-semibold text-lg text-left hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
