// Detailed project data for the recruiter-protected area
// This is the "deeper look" behind the password gate

import { RecruiterProjectDetail } from "@/lib/recruiter-types"

export const RECRUITER_PROJECTS: RecruiterProjectDetail[] = [
  {
    id: "helm",
    title: "Helm — Mission Control",
    subtitle: "Full-stack operations platform for small business",
    timeline: "Jan 2026 – Present",
    role: "Sole Product Engineer (Design + Frontend + Backend + Infra)",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind", "Framer Motion", "Postgres", "Vercel"],
    description:
      "Helm is an all-in-one operations platform I built from scratch for small business management. It handles CRM, project management, Kanban task boards, career/ATS pipelines, email templates, invoice/quote generation, analytics dashboards, landing page content management, and brand asset management — all behind a unified auth system with role-based access control and project mirroring.",
    challenges: [
      "Building a CRM that feels as polished as dedicated tools while integrating deeply with the rest of the platform",
      "Designing a Kanban system with drag-and-drop, task dependencies, and real-time collaboration",
      "Creating an ATS pipeline for career tracking that integrates with email OTP and external applicant data",
      "Handling complex multi-tenant RLS policies in Supabase without performance degradation",
    ],
    architecture: [
      "Next.js App Router with server components for data fetching and client components for interactivity",
      "Supabase for auth, database, RLS, and storage with service role for admin operations",
      "Server actions for form handling and optimistic updates",
      "Resend for transactional email (OTP, notifications, quotes)",
      "Vercel deployment with preview branches for each feature",
    ],
    impact:
      "One codebase replaces 4 separate tools (CRM, project management, ATS, invoicing) with a unified experience. Designed to be <500ms page loads on 3G.",
    links: {
      live: "https://helm.usehelm.com",
      github: "https://github.com/sirjamesgray/helm",
    },
  },
  {
    id: "wewrite",
    title: "WeWrite",
    subtitle: "Mobile-first AI writing platform",
    timeline: "May 2025 – Present",
    role: "Product Engineer (Full-stack + Mobile)",
    tags: ["Next.js", "Expo", "React Native", "TypeScript", "Firebase", "OpenAI", "Tailwind"],
    description:
      "WeWrite is a writing platform that combines AI assistance with real-time collaboration. Users write with AI copilots that adapt to their style, get suggestions inline, and collaborate with team members in shared documents. The mobile app is built with Expo and shares the same API layer as the web app.",
    challenges: [
      "Synchronizing document state between web and mobile clients with offline support",
      "Building an AI copilot that learns a user's voice rather than generating generic text",
      "Designing a mobile-first editor that feels native while sharing code with web",
    ],
    architecture: [
      "Next.js web app + Expo React Native mobile app sharing a common API layer",
      "Firebase for real-time document sync and auth",
      "OpenAI API for AI copilot features with prompt chaining for style adaptation",
      "Tailscale Funnel for mobile testing against local dev environment",
    ],
    impact:
      "Launched with both web and native mobile apps simultaneously. AI copilot reduces writing time by ~40% for power users while maintaining authentic voice.",
    links: {
      live: "https://getwewrite.app",
      github: "https://github.com/sirjamesgray/WeWrite",
    },
  },
  {
    id: "acp-tx",
    title: "ACP TX — Group Travel Platform",
    subtitle: "Event management and RSVP system for group travel",
    timeline: "Aug 2025 – Present",
    role: "Product Engineer (Sole developer, full-stack)",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind", "Resend", "Vercel"],
    description:
      "ACP TX is an event management platform for organized group travel. It handles RSVPs, payment collection, event scheduling with location mapping, team assignments, and email notifications. Built for a real client managing dozens of travel events with hundreds of attendees.",
    challenges: [
      "Building a flexible RSVP system that handles waitlists, plus-ones, and dietary restrictions",
      "Integrating payment tracking without building a full payments system",
      "Creating a location-aware event scheduler with map integration for route planning",
      "Designing a team assignment system that balances groups based on preferences",
    ],
    architecture: [
      "Next.js App Router with server components and server actions",
      "Supabase for data storage with program-scoped event schemas",
      "Resend for transactional email (notifications, confirmations, reminders)",
      "OTP-based email login flow (Resend for sending, HMAC session tokens)",
    ],
    impact:
      "Replaced a manual spreadsheet-driven workflow with a fully automated system. Cut event coordination time by an estimated 60%.",
    links: {
      live: "https://acptx.us",
      github: "https://github.com/LIBERTYMAXXING/acp-tx",
    },
  },
  {
    id: "buzz",
    title: "Buzz Relay",
    subtitle: "SMS relay system for real-time alerts",
    timeline: "Jan 2026",
    role: "Product Engineer (Sole developer)",
    tags: ["Go", "SQLite", "Twilio", "macOS", "launchd"],
    description:
      "Buzz Relay is a Go-based SMS relay daemon that runs as a macOS launchd service. It monitors local files for changes and forwards alerts via Twilio SMS. Designed for critical system notifications that need to reach a phone immediately, bypassing email noise.",
    challenges: [
      "Building a reliable file watcher in Go that handles edge cases (symlinks, temp files, rapid writes)",
      "Designing a launchd service that recovers gracefully from crashes and network interruptions",
      "Rate-limiting SMS notifications to avoid Twilio abuse while ensuring critical alerts get through",
    ],
    architecture: [
      "Pure Go binary with fsnotify for file watching and Twilio REST API for SMS delivery",
      "SQLite for deduplication and rate limiting state",
      "launchd plist for auto-start, crash recovery, and logging",
      "Configurable via YAML with watch patterns and rate-limit thresholds",
    ],
    impact:
      "Powers real-time notifications for personal infrastructure monitoring. Reliably running for months with zero downtime.",
    links: {
      github: "https://github.com/sirjamesgray/buzz-relay",
    },
  },
  {
    id: "portfolio",
    title: "jamiegray.net — Portfolio & CRM",
    subtitle: "Personal brand, CRM, and business platform",
    timeline: "Jan 2026 – Present",
    role: "Product Engineer (Sole developer)",
    tags: ["Next.js", "Supabase", "Stripe", "Tailwind", "Cloudflare Turnstile", "Three.js"],
    description:
      "My personal website is also a full CRM and business platform. It handles client intake via Calendly, Stripe payment processing for project quotes, an admin dashboard with project management and customer views, landing page content management, and a creative portfolio section — all behind a single Next.js codebase.",
    challenges: [
      "Balancing a public-facing portfolio with a full admin CRM in one Next.js app",
      "Building a secure admin auth flow with Turnstile bot protection and Google OAuth",
      "Integrating Stripe payment links with the project quoting workflow",
      "Designing and implementing a custom design system token system",
    ],
    architecture: [
      "Next.js App Router with dynamic route groups for public vs. admin sections",
      "Supabase for auth, database, RLS policies, and file storage",
      "Stripe for payment processing with webhook integration",
      "Cloudflare Turnstile for bot protection on login forms",
      "Custom design system with CSS custom properties and Radix UI primitives",
    ],
    impact:
      "A single codebase serving as portfolio, CRM, and payment platform. Client intake-to-payment flows in under 3 minutes.",
    links: {
      live: "https://www.jamiegray.net",
      github: "https://github.com/sirjamesgray/portfolio",
    },
  },
  {
    id: "acp-site",
    title: "ACP Site — Marketing & Brand",
    subtitle: "Modern marketing site with content management",
    timeline: "Aug 2025 – Present",
    role: "Product Engineer (Sole developer)",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind", "Framer Motion"],
    description:
      "The public-facing marketing site for ACP TX. Features dynamic content managed through an admin CMS, animated landing sections, event showcases, and a blog/news section. Designed to feel premium while loading fast on mobile connections.",
    challenges: [
      "Building a CMS-like experience without a traditional headless CMS — content is managed through the admin dashboard",
      "Creating animations that feel premium but don't compromise page load performance",
      "Designing a mobile-first layout that works for an older demographic",
    ],
    architecture: [
      "Next.js App Router with ISR for content pages",
      "Supabase for content storage with admin-only write access",
      "Framer Motion for scroll-triggered animations",
      "Tailwind CSS with custom design tokens matching the ACP TX brand",
    ],
    impact:
      "A branded marketing site with admin-managed content. Established a professional web presence for a growing organization.",
    links: {
      live: "https://acp-tx.com",
      github: "https://github.com/LIBERTYMAXXING/acp-site",
    },
  },
]