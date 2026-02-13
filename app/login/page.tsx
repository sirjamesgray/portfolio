"use client";

import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { DashboardButton } from "@/components/ui/button";
import { Loader2, Mail, ArrowLeft, Terminal } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const isDev = process.env.NODE_ENV === "development";
const devLoginEnabled = process.env.NEXT_PUBLIC_DEV_LOGIN_ENABLED === "true";

// Get the correct base URL for auth redirects
// Always use window.location.origin to preserve the current context (localhost vs production)
function getAuthRedirectUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return SITE_CONFIG.url;
}

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [devEmail, setDevEmail] = useState("jamiegray2234@gmail.com");
  const [devLoading, setDevLoading] = useState(false);
  const [devError, setDevError] = useState("");

  const handleDevLogin = async () => {
    setDevLoading(true);
    setDevError("");
    try {
      const response = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: devEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDevError(data.error || "Dev login failed");
        return;
      }

      if (data.loginUrl) {
        // Redirect to the magic link URL
        window.location.href = data.loginUrl;
      }
    } catch (err) {
      setDevError("Failed to generate dev login");
    } finally {
      setDevLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const redirectUrl = getAuthRedirectUrl();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectUrl}/auth/callback?next=/dashboard`,
      },
    });
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTurnstileError("");

    try {
      // Verify Turnstile token first (skip in dev mode)
      if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !devLoginEnabled && !turnstileToken) {
        setTurnstileError("Please complete the verification");
        setIsLoading(false);
        return;
      }

      if (turnstileToken && !devLoginEnabled) {
        const verifyResponse = await fetch("/api/auth/verify-turnstile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: turnstileToken }),
        });

        if (!verifyResponse.ok) {
          setTurnstileError("Verification failed. Please try again.");
          turnstileRef.current?.reset();
          setTurnstileToken(null);
          setIsLoading(false);
          return;
        }
      }

      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const redirectUrl = getAuthRedirectUrl();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${redirectUrl}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        console.error("Error sending magic link:", error);
        turnstileRef.current?.reset();
        setTurnstileToken(null);
      } else {
        setEmailSent(true);
      }
    } catch (err) {
      console.error("Error:", err);
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Mail className="h-6 w-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a sign-in link to <strong>{email}</strong>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t receive the email?{" "}
          <button
            onClick={() => setEmailSent(false)}
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to access your dashboard
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
          {decodeURIComponent(error)}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
          {decodeURIComponent(message)}
        </div>
      )}

      {/* Email Sign-In */}
      <form onSubmit={signInWithEmail} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-card/50"
        />

        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !devLoginEnabled && (
          <div className="flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={setTurnstileToken}
              onError={() => setTurnstileError("Verification failed")}
              onExpire={() => setTurnstileToken(null)}
              options={{
                theme: "auto",
                size: "flexible",
              }}
            />
          </div>
        )}

        {turnstileError && (
          <p className="text-sm text-red-500 text-center">{turnstileError}</p>
        )}

        <DashboardButton
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending link...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Continue with Email
            </>
          )}
        </DashboardButton>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Google Sign-In */}
      <button
        onClick={signInWithGoogle}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card"
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

      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/start-project"
          className="text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Start a project
        </Link>
      </p>

      {/* Dev Login - Only visible in development with env var enabled */}
      {isDev && devLoginEnabled && (
        <>
          <div className="relative pt-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashed border-amber-500/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-amber-600 dark:text-amber-400">Dev Only</span>
            </div>
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Terminal className="h-4 w-4" />
              <span className="text-sm font-medium">Dev Login</span>
            </div>
            <Input
              type="email"
              placeholder="Email for dev login"
              value={devEmail}
              onChange={(e) => setDevEmail(e.target.value)}
              className="bg-background/50 border-amber-500/30 text-sm"
            />
            {devError && (
              <p className="text-xs text-red-500">{devError}</p>
            )}
            <DashboardButton
              onClick={handleDevLogin}
              disabled={devLoading || !devEmail}
              className="w-full bg-amber-600 hover:bg-amber-700 text-sm"
            >
              {devLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating link...
                </>
              ) : (
                "Instant Dev Login"
              )}
            </DashboardButton>
            <p className="text-xs text-muted-foreground text-center">
              Bypasses email verification for faster development
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30">
      <SiteHeader />

      <div className="flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="flex flex-col">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
