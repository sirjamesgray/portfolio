"use client";

import { Check, ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubmissionSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30 px-6">
      <BlurFade delay={0.1}>
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Request Submitted!
          </h1>
          <p className="text-muted-foreground mb-8">
            Thanks for reaching out! I&apos;ll review your project details and get back to you within 24 hours. Keep an eye on your inbox.
          </p>
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                Back to Home
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
