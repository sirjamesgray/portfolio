"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, X, Mail, Calendar, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SITE_CONFIG } from "@/lib/constants";

// Get the correct base URL for auth redirects
// Always use window.location.origin to preserve the current context (localhost vs production)
function getAuthRedirectUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return SITE_CONFIG.url;
}

const projectTypes = [
  { value: "website", label: "Website", description: "Business site, portfolio, landing page" },
  { value: "admin-tool", label: "Admin Tool", description: "Dashboard, internal tool, custom software" },
  { value: "other", label: "Something else", description: "Tell me about it" },
];

const budgetRanges = [
  { value: "under-5k", label: "Under $5,000", description: "Simple sites and small projects" },
  { value: "5k-10k", label: "$5,000 - $10,000", description: "Medium complexity projects" },
  { value: "10k-25k", label: "$10,000 - $25,000", description: "Complex apps and systems" },
  { value: "25k-plus", label: "$25,000+", description: "Enterprise and large-scale" },
  { value: "not-sure", label: "Not sure yet", description: "I can help you figure it out" },
];

const timelines = [
  { value: "asap", label: "ASAP", description: "Need it yesterday" },
  { value: "1-month", label: "1 Month", description: "Quick turnaround" },
  { value: "2-3-months", label: "2-3 Months", description: "Standard timeline" },
  { value: "flexible", label: "Flexible", description: "No rush, do it right" },
];

// Step 5 = Calendly scheduling, Step 6 = Contact info (if skipped scheduling and not logged in)
type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function StartProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    projectType: "",
    budget: "",
    timeline: "",
    description: "",
    email: "",
    name: "",
  });

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

  const signInWithGoogle = async () => {
    setIsSubmitting(true);
    // Store form data in sessionStorage before redirect
    sessionStorage.setItem("projectQuestionnaire", JSON.stringify(formData));

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const redirectUrl = getAuthRedirectUrl();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectUrl}/auth/callback?next=/dashboard/success`,
      },
    });
  };

  const submitWithEmail = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/projects/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          projectType: formData.projectType,
          budget: formData.budget,
          timeline: formData.timeline,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }

      // Redirect to success page
      router.push("/start-project/success");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  const handleSelect = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-advance for selection steps (project type, budget, timeline)
    if (field === "projectType" || field === "budget" || field === "timeline") {
      // Small delay for visual feedback before advancing
      setTimeout(() => {
        if (step < 5) {
          setStep((s) => (s + 1) as Step);
        }
      }, 200);
    }
  };

  const isValidEmail = (email: string) => {
    return email.includes("@") && email.includes(".");
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
      case 5:
        return true; // Calendly step - can always proceed (via skip or schedule)
      case 6:
        return formData.name.trim().length > 0 && isValidEmail(formData.email);
      default:
        return false;
    }
  };

  // Submit project for logged-in users (uses their auth info)
  const submitForLoggedInUser = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/projects/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          projectType: formData.projectType,
          budget: formData.budget,
          timeline: formData.timeline,
          description: formData.description,
          isLoggedIn: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }

      const data = await response.json();
      // Redirect to their new project in the dashboard
      router.push(`/dashboard/projects/${data.projectId}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  const openCalendly = () => {
    // Store form data before opening Calendly
    sessionStorage.setItem("projectQuestionnaire", JSON.stringify(formData));
    // Open Calendly in a new window - when they complete scheduling, Calendly webhook captures their info
    window.open(SITE_CONFIG.calendly, "_blank");
  };

  const skipScheduling = () => {
    if (isLoggedIn) {
      // Logged in user skipping scheduling - submit directly
      submitForLoggedInUser();
    } else {
      // Not logged in - go to contact info step
      setStep(6);
    }
  };

  const nextStep = () => {
    if (canProceed() && step < 6) {
      // After step 4 (description), if logged in, go to step 5 (Calendly), otherwise step 5
      if (step === 4) {
        setStep(5);
      } else if (step < 5) {
        setStep((s) => (s + 1) as Step);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      // If on step 6, go back to step 5 (Calendly)
      if (step === 6) {
        setStep(5);
      } else {
        setStep((s) => (s - 1) as Step);
      }
    }
  };

  // Determine total steps: logged in users have 5 steps, logged out have 6
  const totalSteps = isLoggedIn ? 5 : 6;
  // For progress indicator, map current step to display step
  const displayStep = step;

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
          {/* Progress indicator */}
          <BlurFade delay={0.1}>
            <div className="mb-8 flex justify-center gap-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className={`h-2 w-10 rounded-full transition-colors ${
                    s <= displayStep
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

          {/* Step 4: Description */}
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
                  className="w-full rounded-xl border border-border bg-card/50 p-4 text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[150px] resize-none"
                />
              </div>
            </BlurFade>
          )}

          {/* Step 5: Schedule Consultation */}
          {step === 5 && (
            <BlurFade delay={0.2}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Let&apos;s talk about your project
                </h1>
                <p className="text-muted-foreground">
                  Schedule a free 30-minute consultation to discuss your needs.
                </p>
              </div>
              <div className="space-y-6">
                {/* Schedule consultation button */}
                <Button
                  onClick={openCalendly}
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 py-6 text-base"
                >
                  <Calendar className="h-5 w-5" />
                  Schedule Consultation
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  I&apos;ll collect your contact info during scheduling.
                </p>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                {/* Skip scheduling option */}
                <Button
                  variant="outline"
                  onClick={skipScheduling}
                  disabled={isSubmitting}
                  className="w-full gap-2 py-6 text-base"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <SkipForward className="h-5 w-5" />
                  )}
                  {isSubmitting ? "Creating project..." : isLoggedIn ? "Skip & Create Project" : "Skip & Enter Contact Info"}
                </Button>

                {submitError && (
                  <p className="text-sm text-red-500 text-center">{submitError}</p>
                )}

                {isLoggedIn && (
                  <p className="text-sm text-muted-foreground text-center">
                    Signed in as <span className="font-medium text-foreground">{userName}</span> ({userEmail})
                  </p>
                )}
              </div>
            </BlurFade>
          )}

          {/* Step 6: Contact Info (only shown if not logged in and skipped scheduling) */}
          {step === 6 && (
            <BlurFade delay={0.2}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  How can I reach you?
                </h1>
                <p className="text-muted-foreground">
                  I&apos;ll get back to you within 24 hours.
                </p>
              </div>
              <div className="space-y-6">
                {/* Contact form - Name first, then email */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Your name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleSelect("name", e.target.value)}
                      placeholder="Jamie Gray"
                      className="w-full rounded-xl border border-border bg-card/50 p-4 text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleSelect("email", e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-border bg-card/50 p-4 text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {submitError && (
                  <p className="text-sm text-red-500 text-center">{submitError}</p>
                )}

                {/* Submit button */}
                <Button
                  onClick={submitWithEmail}
                  disabled={!canProceed() || isSubmitting}
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 py-6 text-base"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Mail className="h-5 w-5" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                {/* Sign in with Google option */}
                <div className="rounded-xl border border-border bg-card/30 p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Sign in to track your project&apos;s progress in a dashboard
                  </p>
                  <button
                    onClick={signInWithGoogle}
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
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
                    Continue with Google
                  </button>
                  <p className="text-xs text-muted-foreground mt-2">
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
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {step < 5 && (
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
