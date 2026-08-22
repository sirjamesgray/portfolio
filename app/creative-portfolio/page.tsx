"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { DashboardButton } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Loader2,
  Sparkles,
  BriefcaseBusiness,
  Globe,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  Wrench,
  Layers,
  Bot,
  Zap,
  Eye,
  ShieldCheck,
  FileDown,
} from "lucide-react";

const PORTFOLIO_ITEMS = [
  {
    title: "Helm — Mission Control",
    tagline: "Product intelligence dashboard for a 10+ project portfolio",
    description:
      "Built a full-stack operating console that monitors products, social KPIs, infrastructure spending, and career pipeline. Uses agentic AI workflows throughout — the app itself demonstrates how AI can accelerate product engineering.",
    highlights: [
      "Drill-down navigation with breadcrumbs and animated transitions",
      "Visual snapshot timeline with Playwright-based regression capture",
      "Per-listing resume tailor pipeline using Claude Sonnet via OpenRouter",
      "Server manager, telemetry, vault, tasks, and collateral pipeline",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind v4", "SQLite", "OpenRouter API", "Playwright"],
    links: [
      { label: "GitHub", url: "https://github.com/sirjamesgray/helm" },
      { label: "Live Demo", url: "http://localhost:3109" },
    ],
    icon: <Layers className="h-5 w-5" />,
  },
  {
    title: "WeWrite — Social Writing Platform",
    tagline: "Founder-led product from idea to shipped platform",
    description:
      "A social writing platform where every page can raise funds. Built from scratch with AI coding agents — migrated from JavaScript to type-safe TypeScript, rebuilt UI around user-customizable color tokens, and integrated Resend for transactional email.",
    highlights: [
      "Full-stack Next.js + Firebase architecture with API layer",
      "Customizable theme system with color tokens and dark mode",
      "Monetization via Stripe integration on every page",
      "Expo React Native mobile app for cross-platform reach",
    ],
    stack: ["Next.js", "TypeScript", "Firebase", "Stripe", "Resend", "React Native", "Expo"],
    links: [
      { label: "Website", url: "https://getwewrite.app" },
      { label: "GitHub", url: "https://github.com/sirjamesgray/WeWrite" },
    ],
    icon: <Globe className="h-5 w-5" />,
  },
  {
    title: "ACP TX — Volunteer Management",
    tagline: "Enterprise platform for a statewide nonprofit",
    description:
      "Full-featured platform for managing volunteers, events, tasks, and teams across Texas. Features include hierarchical team assignment, Google Calendar sync, email OTP login, media management, and automated email campaigns.",
    highlights: [
      "Hierarchical team selector with parent-chain resolution",
      "Google Calendar OAuth integration with automatic sync",
      "Email login with OTP / magic-link authentication",
      "Automated email campaigns via Resend for event communication",
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Resend", "Google Calendar API", "Vercel"],
    links: [
      { label: "Website", url: "https://acptx.us" },
      { label: "GitHub", url: "https://github.com/LIBERTYMAXXING/acp-tx" },
    ],
    icon: <BriefcaseBusiness className="h-5 w-5" />,
  },
  {
    title: "Hermes Agent — AI Operating System",
    tagline: "AI agent infrastructure powering my entire workflow",
    description:
      "The AI agent framework I use daily. Hermes handles coding, research, cron jobs, multi-agent orchestration, browser automation, and delivers results across Telegram, Discord, and SMS. I extend it with custom skills, plugins, and MCP servers.",
    highlights: [
      "Custom skill authoring for reusable workflows across projects",
      "Multi-agent orchestration for parallel coding tasks",
      "Plugin development for Hermes Desktop app",
      "Cron automation for daily briefings, health checks, and monitors",
    ],
    stack: ["Python", "TypeScript", "OpenRouter", "Playwright", "SQLite", "Telegram API"],
    links: [
      { label: "Documentation", url: "https://hermes-agent.nousresearch.com/docs" },
      { label: "GitHub", url: "https://github.com/sirjamesgray" },
    ],
    icon: <Bot className="h-5 w-5" />,
  },
  {
    title: "Car Freedom",
    tagline: "Consumer auto-buying experience",
    description:
      "A Next.js application reimagining the car-buying experience. Built with Supabase backend and Tailwind CSS frontend, featuring user authentication, vehicle listings, and an intuitive browsing interface.",
    highlights: [
      "User authentication and profile management",
      "Vehicle listing and search with filtering",
      "Responsive design optimized for mobile-first browsing",
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Vercel"],
    links: [
      { label: "GitHub", url: "https://github.com/sirjamesgray/car-freedom" },
    ],
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Lucent Wash — Full Customer Platform",
    tagline: "End-to-end service business from discovery to follow-up",
    description:
      "Built the marketing site and full customer platform including online booking, scheduling, authentication, Stripe payments, and automated SMS reminders. Designed the complete customer journey from first visit to post-service follow-up.",
    highlights: [
      "Online booking and scheduling system with real-time availability",
      "Automated SMS reminders via Twilio integration",
      "Stripe payment processing with invoice management",
      "Full customer portal with order history and preferences",
    ],
    stack: ["Next.js", "TypeScript", "Stripe", "Twilio", "Supabase", "Tailwind CSS"],
    links: [
      { label: "Website", url: "https://lucentwash.com" },
    ],
    icon: <Globe className="h-5 w-5" />,
  },
];

function PortfolioContent({ onLock }: { onLock: () => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-950/10 dark:to-emerald-950/20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Sparkles className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-sm font-bold">Creative Portfolio</h1>
              <p className="text-[10px] text-muted-foreground">Jamie Gray · Product Engineer & Creative Technologist</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Home
            </Link>
            <button
              onClick={onLock}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Lock className="h-3.5 w-3.5" /> Lock
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Intro */}
        <section className="mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3 w-3" /> Creative Technologist Portfolio
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Design + Engineering + Agentic AI
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            I bridge product design, full-stack development, and AI agent workflows to ship
            production applications faster. Each project below was built end-to-end — from
            UX concept through architecture, implementation, and deployment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: "8+ years experience", icon: <BriefcaseBusiness className="h-3.5 w-3.5" /> },
              { label: "Full-stack + design", icon: <Wrench className="h-3.5 w-3.5" /> },
              { label: "Agentic AI daily", icon: <Bot className="h-3.5 w-3.5" /> },
              { label: "Rapid prototyping", icon: <Zap className="h-3.5 w-3.5" /> },
            ].map((trait) => (
              <span
                key={trait.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground"
              >
                {trait.icon}
                {trait.label}
              </span>
            ))}
          </div>
        </section>

        {/* Project Cards */}
        <div className="grid gap-6">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group rounded-xl border border-border bg-card transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="flex w-full items-start gap-4 p-5 text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold">{item.title}</h3>
                      <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">{item.tagline}</p>
                    </div>
                    <ChevronRight
                      className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                        expanded === i ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>

                  {/* Stack tags (always visible) */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-emerald-500/5 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expanded === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border px-5 pb-5 pt-4">
                      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Key Highlights
                      </h4>
                      <ul className="mb-4 space-y-2">
                        {item.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {item.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <section className="mt-16 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
          <h3 className="text-lg font-bold">Interested in working together?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            I&apos;m currently exploring Creative Technologist roles where I can
            bring design intuition, engineering rigor, and AI-powered workflows
            to a team that values all three.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:contact@jamiegray.net"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              contact@jamiegray.net
            </a>
            <a
              href="https://www.linkedin.com/in/jamiegraytech/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function CreativePortfolioPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check session storage for existing unlock
    const stored = sessionStorage.getItem("portfolio_unlocked");
    if (stored === "true") setUnlocked(true);
  }, []);

  const handleUnlock = useCallback(async () => {
    if (!password.trim()) {
      setError("Enter the password to continue.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/creative-portfolio/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setError("Incorrect password. Try again.");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("portfolio_unlocked", "true");
      setUnlocked(true);
    } catch {
      setError("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  }, [password]);

  const handleLock = useCallback(() => {
    sessionStorage.removeItem("portfolio_unlocked");
    setUnlocked(false);
    setPassword("");
    setError("");
  }, []);

  if (unlocked) return <PortfolioContent onLock={handleLock} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-950/10 dark:to-emerald-950/20">
      <SiteHeader />

      <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="rounded-xl border border-border bg-card p-8 shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
              <Lock className="h-6 w-6 text-emerald-500" />
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-xl font-bold">Creative Portfolio</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Password-protected portfolio for recruiters and teams.
              </p>
              <p className="mt-1 text-xs text-muted-foreground italic">
                The password is in the cover letter or email.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Input
                ref={inputRef}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                className="bg-background text-center text-lg tracking-widest"
                autoFocus
              />
              {error && (
                <p className="text-center text-xs text-red-500">{error}</p>
              )}
              <DashboardButton
                onClick={handleUnlock}
                disabled={loading || !password.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    View Portfolio
                  </>
                )}
              </DashboardButton>
            </div>

            <p className="mt-6 text-center text-[10px] text-muted-foreground">
              <Link href="/" className="hover:underline">Back to jamiegray.net</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}