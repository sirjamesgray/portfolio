"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";

const projectTypes = [
  { value: "website", label: "Website", description: "Business site, portfolio, landing page" },
  { value: "admin-tool", label: "Admin Tool", description: "Dashboard, internal tool, custom software" },
  { value: "other", label: "Something else", description: "Let's figure it out together" },
];

const budgetRanges = [
  { value: "under-5k", label: "Under $5,000", description: "Simple sites and small projects" },
  { value: "5k-10k", label: "$5,000 - $10,000", description: "Medium complexity projects" },
  { value: "10k-25k", label: "$10,000 - $25,000", description: "Complex apps and systems" },
  { value: "25k-plus", label: "$25,000+", description: "Enterprise and large-scale" },
  { value: "not-sure", label: "Not sure yet", description: "Let's discuss what's possible" },
];

const timelines = [
  { value: "asap", label: "ASAP", description: "Need it yesterday" },
  { value: "1-month", label: "1 Month", description: "Quick turnaround" },
  { value: "2-3-months", label: "2-3 Months", description: "Standard timeline" },
  { value: "flexible", label: "Flexible", description: "No rush, do it right" },
];

type Step = 1 | 2 | 3 | 4;

export default function StartProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectType: "",
    budget: "",
    timeline: "",
    description: "",
  });

  const signInWithGoogle = async () => {
    setIsSubmitting(true);
    // Store form data in sessionStorage before redirect
    sessionStorage.setItem("projectQuestionnaire", JSON.stringify(formData));

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/success`,
      },
    });
  };

  const handleSelect = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.projectType !== "";
      case 2:
        return formData.budget !== "";
      case 3:
        return formData.timeline !== "";
      case 4:
        return formData.description.trim().length > 10;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceed() && step < 4) {
      setStep((s) => (s + 1) as Step);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as Step);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30">
      {/* Close button */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-xl">
          {/* Progress indicator */}
          <BlurFade delay={0.1}>
            <div className="mb-8 flex justify-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-12 rounded-full transition-colors ${
                    s <= step
                      ? "bg-emerald-600 dark:bg-emerald-500"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </BlurFade>

          {/* Step 1: Project Type */}
          {step === 1 && (
            <BlurFade delay={0.2}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  What are you building?
                </h1>
                <p className="text-muted-foreground">
                  Select the type of project you need help with.
                </p>
              </div>
              <div className="grid gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleSelect("projectType", type.value)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                      formData.projectType === type.value
                        ? "border-emerald-500 dark:border-emerald-400 bg-emerald-500/10"
                        : "border-border bg-card/50 hover:border-muted-foreground/50"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-foreground">{type.label}</p>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    {formData.projectType === type.value && (
                      <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </BlurFade>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (
            <BlurFade delay={0.2}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  What&apos;s your budget?
                </h1>
                <p className="text-muted-foreground">
                  This helps me understand the scope of your project.
                </p>
              </div>
              <div className="grid gap-3">
                {budgetRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handleSelect("budget", range.value)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                      formData.budget === range.value
                        ? "border-emerald-500 dark:border-emerald-400 bg-emerald-500/10"
                        : "border-border bg-card/50 hover:border-muted-foreground/50"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-foreground">{range.label}</p>
                      <p className="text-sm text-muted-foreground">{range.description}</p>
                    </div>
                    {formData.budget === range.value && (
                      <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </BlurFade>
          )}

          {/* Step 3: Timeline */}
          {step === 3 && (
            <BlurFade delay={0.2}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  When do you need it?
                </h1>
                <p className="text-muted-foreground">
                  Choose your ideal timeline.
                </p>
              </div>
              <div className="grid gap-3">
                {timelines.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => handleSelect("timeline", t.value)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                      formData.timeline === t.value
                        ? "border-emerald-500 dark:border-emerald-400 bg-emerald-500/10"
                        : "border-border bg-card/50 hover:border-muted-foreground/50"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-foreground">{t.label}</p>
                      <p className="text-sm text-muted-foreground">{t.description}</p>
                    </div>
                    {formData.timeline === t.value && (
                      <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </BlurFade>
          )}

          {/* Step 4: Description + Sign Up */}
          {step === 4 && (
            <BlurFade delay={0.2}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Tell me more
                </h1>
                <p className="text-muted-foreground">
                  Briefly describe your project idea. What problem are you solving?
                </p>
              </div>
              <div className="space-y-6">
                <textarea
                  value={formData.description}
                  onChange={(e) => handleSelect("description", e.target.value)}
                  placeholder="I need a website for my bakery that shows our menu, location, and lets customers place orders for pickup..."
                  className="w-full rounded-xl border border-border bg-card/50 p-4 text-foreground placeholder:text-muted-foreground focus:border-emerald-500 dark:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[150px] resize-none"
                />

                <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign up to submit your project and I&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={signInWithGoogle}
                    disabled={!canProceed() || isSubmitting}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    {isSubmitting ? "Redirecting..." : "Continue with Google"}
                  </button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Already have an account? <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline">Log in</Link>
                  </p>
                </div>
              </div>
            </BlurFade>
          )}

          {/* Navigation */}
          <BlurFade delay={0.3}>
            <div className="mt-8 flex justify-between">
              <Button
                variant="ghost"
                onClick={step === 1 ? () => router.back() : prevStep}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {step < 4 && (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="gap-2 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
