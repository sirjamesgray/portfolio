"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, X, Calendar, Zap, Rocket, Ship, HelpCircle } from "lucide-react";
import { DashboardButton } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SITE_CONFIG } from "@/lib/constants";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const sprintTypes = [
  {
    value: "1-week-mvp",
    label: "1-week MVP sprint",
    description: "Ship a working prototype fast",
    icon: Zap,
    price: "$2,500"
  },
  {
    value: "2-week-build",
    label: "2-week build sprint",
    description: "Build something more complete",
    icon: Rocket,
    price: "$5,000"
  },
  {
    value: "3-week-ship",
    label: "3-week ship sprint",
    description: "Ship something ambitious",
    icon: Ship,
    price: "$9,000"
  },
  {
    value: "not-sure",
    label: "Not sure — help me decide",
    description: "Let's figure it out together",
    icon: HelpCircle,
    price: null
  },
];

type Step = 1 | 2 | 3;

function StartProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    sprintType: "",
    description: "",
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  // Check for sprint query param and pre-select
  useEffect(() => {
    const sprintParam = searchParams.get("sprint");
    if (sprintParam) {
      const validSprints = sprintTypes.map(s => s.value);
      if (validSprints.includes(sprintParam)) {
        setFormData(prev => ({ ...prev, sprintType: sprintParam }));
        setStep(2); // Skip to description step
      }
    }
  }, [searchParams]);

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email || "");
        setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "");
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, []);

  const handleSelect = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-advance for sprint type selection
    if (field === "sprintType") {
      setTimeout(() => {
        setStep(2);
      }, 200);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.sprintType !== "";
      case 2:
        return formData.description.trim().length > 10;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const openCalendly = () => {
    // Store form data before opening Calendly
    sessionStorage.setItem("projectQuestionnaire", JSON.stringify(formData));
    // Open Calendly in a new window
    window.open(SITE_CONFIG.calendly, "_blank");
  };

  // Submit project and open Calendly
  const submitAndSchedule = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    // Check turnstile token if configured
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setSubmitError("Please complete the verification");
      setIsSubmitting(false);
      return;
    }

    try {
      // Store form data for potential later use
      sessionStorage.setItem("projectQuestionnaire", JSON.stringify(formData));

      // If logged in, create a project record
      if (isLoggedIn) {
        const response = await fetch("/api/projects/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
            projectType: formData.sprintType,
            budget: formData.sprintType === "1-week-mvp" ? "2500" : formData.sprintType === "2-week-build" ? "5000" : formData.sprintType === "3-week-ship" ? "9000" : "not-sure",
            description: formData.description,
            isLoggedIn: true,
            turnstileToken,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          turnstileRef.current?.reset();
          setTurnstileToken(null);
          throw new Error(data.error || "Failed to submit");
        }
      }

      // Open Calendly
      window.open(SITE_CONFIG.calendly, "_blank");

      // Show success state
      setStep(3);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (canProceed() && step < 3) {
      setStep((s) => (s + 1) as Step);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as Step);
    }
  };

  const totalSteps = 2;

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
          {/* Progress indicator - hide on step 3 (success) */}
          {step < 3 && (
            <BlurFade delay={0.1}>
              <div className="mb-8 flex justify-center gap-2">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                  <div
                    key={s}
                    className={`h-2 w-10 rounded-full transition-colors ${
                      s <= step
                        ? "bg-emerald-600 dark:bg-emerald-500"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </BlurFade>
          )}

          {/* Step 1: Sprint Type */}
          {step === 1 && (
            <BlurFade delay={0.2}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  What do you want to ship?
                </h1>
                <p className="text-muted-foreground">
                  Choose the sprint that fits your goals.
                </p>
              </div>
              <div className="grid gap-3">
                {sprintTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => handleSelect("sprintType", type.value)}
                      className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                        formData.sprintType === type.value
                          ? "border-emerald-500 dark:border-emerald-400 bg-emerald-500/10"
                          : "border-border bg-card/50 hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          formData.sprintType === type.value
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{type.label}</p>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {type.price && (
                          <span className="text-sm font-medium text-muted-foreground">
                            {type.price}
                          </span>
                        )}
                        {formData.sprintType === type.value && (
                          <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                <Link href="/pricing" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  View full pricing details
                </Link>
              </p>
            </BlurFade>
          )}

          {/* Step 2: Description */}
          {step === 2 && (
            <BlurFade delay={0.2}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  What&apos;s the idea?
                </h1>
                <p className="text-muted-foreground">
                  Tell me what you want to build. Keep it brief — we&apos;ll dig into details on our call.
                </p>
              </div>
              <div className="space-y-6">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="I need a landing page for my SaaS product that captures emails and explains the core features..."
                  className="w-full rounded-xl border border-border bg-card/50 p-4 text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[150px] resize-none"
                  autoFocus
                />

                {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                  <div className="flex justify-center">
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                      onSuccess={setTurnstileToken}
                      onError={() => setSubmitError("Verification failed. Please try again.")}
                      onExpire={() => setTurnstileToken(null)}
                      options={{
                        theme: "auto",
                        size: "flexible",
                      }}
                    />
                  </div>
                )}

                {submitError && (
                  <p className="text-sm text-red-500 text-center">{submitError}</p>
                )}

                <DashboardButton
                  onClick={submitAndSchedule}
                  disabled={!canProceed() || isSubmitting}
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 py-6 text-base"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Calendar className="h-5 w-5" />
                  )}
                  {isSubmitting ? "Saving..." : "Book a Call"}
                </DashboardButton>

                <p className="text-sm text-muted-foreground text-center">
                  We&apos;ll hop on a quick call to discuss scope and next steps.
                </p>

                {isLoggedIn && (
                  <p className="text-sm text-muted-foreground text-center">
                    Signed in as <span className="font-medium text-foreground">{userName}</span>
                  </p>
                )}
              </div>
            </BlurFade>
          )}

          {/* Step 3: Success / Calendly opened */}
          {step === 3 && (
            <BlurFade delay={0.2}>
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  You&apos;re all set!
                </h1>
                <p className="text-muted-foreground mb-8">
                  Calendly should have opened in a new tab. If not, click below to schedule.
                </p>
                <div className="space-y-4">
                  <DashboardButton
                    onClick={openCalendly}
                    className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 py-6 text-base"
                  >
                    <Calendar className="h-5 w-5" />
                    Open Calendly
                  </DashboardButton>
                  <Link href="/">
                    <DashboardButton variant="ghost" className="w-full">
                      Back to Home
                    </DashboardButton>
                  </Link>
                </div>
              </div>
            </BlurFade>
          )}

          {/* Navigation - hide on step 3 */}
          {step < 3 && (
            <BlurFade delay={0.3}>
              <div className="mt-8 flex justify-between">
                <DashboardButton
                  variant="ghost"
                  onClick={step === 1 ? () => router.back() : prevStep}
                  className="gap-2"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </DashboardButton>
                {step === 1 && (
                  <DashboardButton
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="gap-2 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </DashboardButton>
                )}
              </div>
            </BlurFade>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StartProjectPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <StartProjectContent />
    </Suspense>
  );
}
