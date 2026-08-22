"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowUpRight,
  Lock,
  User,
  Building2,
  MessageSquare,
  CheckCircle2,
  Briefcase,
  Clock,
  Code2,
  Target,
  Server,
  TrendingUp,
  ExternalLink,
  Github,
  Sparkles,
  Loader2,
  Eye,
  ShieldCheck,
  FileDown,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { LandingButton } from "@/components/ui/landing-button"
import { RECRUITER_PROJECTS } from "@/lib/recruiter-projects"
import type { RecruiterSession } from "@/lib/recruiter-types"
import type { RecruiterProjectDetail } from "@/lib/recruiter-types"

// --- Gate Section ---

function GateSection({
  onAuthenticated,
}: {
  onAuthenticated: (session: RecruiterSession) => void
}) {
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/recruiter/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, name, company, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Invalid password. Please try again.")
        return
      }

      onAuthenticated(data.session)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Private Project Portfolio
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            This area contains detailed project breakdowns for recruiters and
            hiring managers. Enter the shared password and introduce yourself so
            I know who&apos;s stopping by.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter the shared password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-card/50"
            />
          </div>

          <div className="border-t border-border pt-5 space-y-4">
            <p className="text-xs text-muted-foreground text-center">
              Introduce yourself so I know who&apos;s viewing
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Your Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g. Sarah from Google"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-card/50 pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Company or Agency
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Company name (optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-card/50 pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Say Hi
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  placeholder="What role are you recruiting for? Any message for me?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-500 bg-red-500/10 rounded-lg p-3 text-center"
            >
              {error}
            </motion.p>
          )}

          <LandingButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Verifying...
              </span>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Unlock Portfolio
              </>
            )}
          </LandingButton>
        </form>
      </motion.div>
    </div>
  )
}

// --- Project Card ---

function ProjectCard({
  project,
  index,
}: {
  project: RecruiterProjectDetail
  index: number
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <div
        className="rounded-xl border border-border bg-card/50 overflow-hidden cursor-pointer transition-all duration-200 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground">{project.subtitle}</p>
            </div>
            <ChevronIcon expanded={expanded} />
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {project.timeline}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              {project.role}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-6 border-t border-border pt-5">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-emerald-500" />
                    Overview
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {project.challenges.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-amber-500" />
                      Challenges
                    </h4>
                    <ul className="space-y-1.5">
                      {project.challenges.map((c, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex gap-2"
                        >
                          <span className="text-amber-500 mt-0.5 shrink-0">
                            &raquo;
                          </span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Server className="h-4 w-4 text-blue-500" />
                    Architecture & Tech
                  </h4>
                  <ul className="space-y-1.5">
                    {project.architecture.map((a, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex gap-2"
                      >
                        <span className="text-blue-500 mt-0.5 shrink-0">
                          &raquo;
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    Impact
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.impact}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live Site
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="h-3.5 w-3.5" />
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <motion.svg
      animate={{ rotate: expanded ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      className="h-5 w-5 text-muted-foreground shrink-0 mt-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </motion.svg>
  )
}

// --- Projects Section ---

function ProjectsSection() {
  const projects = RECRUITER_PROJECTS

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-12"
      >
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-foreground">
            My Projects
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click any project to see the full breakdown — architecture decisions,
            technical challenges, and real-world impact. These are the projects
            I&apos;ve built end-to-end, from design through deployment.
          </p>
        </div>

        <div className="space-y-4">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="text-center space-y-4 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Interested in working together or have a role that fits?
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/contact">
              <LandingButton variant="primary" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Get in Touch
              </LandingButton>
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 px-6 py-3 text-base rounded-xl border border-border bg-card/50 text-foreground hover:bg-card transition-colors font-medium"
            >
              <ArrowUpRight className="h-4 w-4" />
              View Resume
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// --- Main Page ---

export default function ProtectedPage() {
  const [session, setSession] = useState<RecruiterSession | null>(null)
  const [checking, setChecking] = useState(true)
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Check for existing session on load
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/recruiter/session")
        if (res.ok) {
          const data = await res.json()
          if (data.authenticated) {
            setSession(data.session)
          }
        }
      } catch {
        // No session
      } finally {
        setChecking(false)
      }
    }
    checkSession()
  }, [])

  // Session heartbeat ping — updates last_active_at every 30s
  useEffect(() => {
    if (!session) return

    const ping = async () => {
      try {
        await fetch("/api/recruiter/ping", { method: "POST" })
      } catch {
        // Silently fail — session still works
      }
    }

    ping() // Initial ping
    pingIntervalRef.current = setInterval(ping, 30000)

    return () => {
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
    }
  }, [session])

  return (
    <div className="min-h-svh bg-gradient-to-br from-background via-background to-emerald-950/10 dark:to-emerald-950/20">
      <SiteHeader />

      <main className="pt-16">
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {checking ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : session ? (
          <ProjectsSection />
        ) : (
          <GateSection onAuthenticated={setSession} />
        )}
      </main>

      <Footer />
    </div>
  )
}