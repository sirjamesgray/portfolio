<div align="center">

# jamiegray.net

**Portfolio. CRM. Design system. Payment platform. One codebase.**

Built by a product engineer who ships end-to-end — from pixel-perfect UI to Stripe webhooks.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel)](https://www.jamiegray.net)

[**Live Site**](https://www.jamiegray.net) · [**Spec**](./SPEC.md) · [**Contact**](https://www.jamiegray.net/contact)

</div>

---

## What This Is

This isn't a template. It's the production system behind my freelance business — **50k+ lines of TypeScript** powering everything from the marketing site visitors see to the admin dashboard where I manage client projects, send invoices, and publish case studies.

I open-sourced it because talk is cheap. The code speaks for itself.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        VISITORS                                 │
│                                                                 │
│   Landing Page ─── Projects ─── Pricing ─── Start Project      │
│        │               │            │             │             │
│   Design System    Case Studies  Stripe Link  6-Step Form       │
│   Experiments                                 + Calendly        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                     ┌─────┴─────┐
                     │  Next.js  │
                     │ App Router│
                     └─────┬─────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────┴──────┐ ┌──────┴──────┐ ┌───────┴──────┐
   │  Supabase   │ │   Stripe    │ │   Resend     │
   │  Auth + DB  │ │  Payments   │ │   Email      │
   │  Storage    │ │  Webhooks   │ │  Templates   │
   └─────────────┘ └─────────────┘ └──────────────┘
          │
   ┌──────┴──────┐
   │  Calendly   │
   │  Scheduling │
   └─────────────┘
```

## The Stack

| Layer | Tech |
|-------|------|
| **Framework** | Next.js 16 (Turbopack), React 19, TypeScript (strict) |
| **Styling** | Tailwind CSS v4, Framer Motion, CSS animations |
| **Auth** | Supabase SSR (Google OAuth + Magic Link + Turnstile CAPTCHA) |
| **Database** | Supabase (Postgres + Row-Level Security + 33 migrations) |
| **Payments** | Stripe (quotes, invoices, webhooks with HMAC verification) |
| **Scheduling** | Calendly (webhook with timing-safe signature verification) |
| **Email** | Resend + React Email templates |
| **3D / Video** | Three.js (React Three Fiber) + Remotion |
| **CMS** | Tiptap rich text editor with custom React component embedding |
| **Deployment** | Vercel (push-to-deploy from `main`) |

## Features at a Glance

### Public Site
- **Landing pages** with feature-flag-driven A/B testing
- **Interactive experiments** — 3D logos, liquid metal shaders, heatmap visualizations, time machine UI
- **Design system** page showcasing every component with live editing
- **Before/after slider** for project case studies (pan, zoom, fullscreen)
- **UI showcase** — infinite-scrolling marquee of 20+ auto-animating components
- **Dark/light/system theming** with animated toggle

### Client Management (Full CRM)

```
Lead → Consultation → Quote → Payment → Development → Delivery
 │         │            │        │           │            │
 ▼         ▼            ▼        ▼           ▼            ▼
Form    Calendly     Stripe   Stripe     Rich-text    Case study
submit  webhook      quote    invoice    CMS editor   published
        + email      + email  + webhook  + assets     to landing
```

- **Start Project flow** — 6-step questionnaire → Calendly booking → auto-project creation
- **Quote/invoice lifecycle** — draft → sent → accepted → paid (all Stripe-native)
- **CMS editor** — Tiptap-powered with custom BeforeAfter slider nodes, image upload, rich formatting
- **Admin dashboard** — projects, customers, emails, feature flags, workflow visualization, video management
- **Client dashboard** — their projects, quotes, invoices, and deliverables
- **Mirror mode** — view the app as any client (with safety warnings)

### Webhooks
| Endpoint | Events |
|----------|--------|
| `POST /api/webhooks/stripe` | `invoice.paid`, `invoice.payment_failed`, `invoice.sent` |
| `POST /api/webhooks/calendly` | `invitee.created`, `invitee.canceled` |

Both use **HMAC signature verification** — Stripe via `constructEvent`, Calendly via `crypto.timingSafeEqual`.

## Highlighted Components

| Component | What it does |
|-----------|-------------|
| **BeforeAfterSlider** | Drag-to-compare image slider with pan/zoom, fullscreen portal, touch support |
| **ExperienceTimeline** | Animated vertical timeline with alternating cards, glow effects, hover highlights |
| **UIShowcase** | Two-row marquee of 20+ auto-triggering widgets (toggles, sliders, counters, icons) |
| **Logo3D / Logo3DGlassy** | Three.js logo rendered with React Three Fiber + Drei |
| **LiquidMetalLogo** | WebGL shader-based liquid metal effect |
| **HeatmapLogo** | Interactive heatmap visualization |
| **TimeMachine** | Experimental time-based UI component |
| **TwinklingSparkles** | Ambient sparkle animations with context-driven toggle |
| **CMSContentRenderer** | Parses stored HTML and hydrates embedded React components at runtime |

## Project Structure

```
├── app/
│   ├── page.tsx                    # Landing page (feature-flag-driven)
│   ├── login/                      # Google OAuth + Magic Link + Turnstile
│   ├── auth/callback/              # OAuth callback handler
│   ├── start-project/              # 6-step project questionnaire
│   ├── projects/[id]/              # Public project case studies
│   ├── pricing/                    # Pricing page
│   ├── design-system/              # Live component showcase
│   ├── experiments/                # Interactive experiments
│   │   ├── factory-os/             # Factory OS experiment
│   │   ├── heatmap-logo/           # Heatmap visualization
│   │   ├── liquid-metal-logo/      # WebGL shader experiment
│   │   ├── time-machine/           # Time machine UI
│   │   └── ui-showcase/            # Component showcase
│   ├── dashboard/
│   │   ├── (overview)/             # Dashboard home (admin vs client)
│   │   ├── admin/                  # Full admin suite
│   │   │   ├── projects/[id]/      # Project management + CMS editor
│   │   │   ├── customers/          # Customer management
│   │   │   ├── feature-flags/      # Runtime feature toggles
│   │   │   ├── emails/             # Email preview + send
│   │   │   └── ...                 # Videos, experiments, workflow
│   │   ├── projects/               # Client project view
│   │   └── payments/               # Client payment history
│   ├── api/
│   │   ├── projects/               # Featured projects, submissions
│   │   ├── quotes/                 # Quote CRUD + client response
│   │   ├── invoices/               # Invoice management
│   │   ├── admin/                  # Admin-only endpoints (auth-gated)
│   │   ├── upload/                 # Image upload (admin-only)
│   │   └── webhooks/               # Stripe + Calendly handlers
│   └── landing/                    # A/B landing page variants
├── components/                     # 122 components
│   ├── ui/                         # shadcn/ui + Magic UI primitives
│   ├── dashboard/                  # CMS editor, admin panels
│   ├── before-after-slider.tsx     # Image comparison component
│   ├── experience-timeline.tsx     # Work history timeline
│   ├── ui-showcase.tsx             # Auto-animating widget gallery
│   ├── logo-3d.tsx                 # Three.js 3D logo
│   └── ...
├── emails/                         # React Email templates
├── lib/
│   ├── supabase/                   # Client, server, admin, middleware
│   ├── stripe.ts                   # Stripe client + webhook helpers
│   ├── feature-flags.ts            # Database-driven feature flags
│   ├── constants.ts                # Site config, CTAs, admin list
│   └── ...
├── remotion/                       # Video generation with Remotion
├── supabase/migrations/            # 33 SQL migrations (full schema)
└── scripts/                        # Seed data, cleanup, migrations
```

## Getting Started

### Prerequisites
- Node.js 20.9.0+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account (for payments)

### Install & Run

```bash
git clone https://github.com/sirjamesgray/portfolio.git
cd portfolio
npm install
```

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_WEBHOOK_SECRET_LOCAL=          # optional, for local dev

# Calendly (optional)
CALENDLY_WEBHOOK_SIGNING_KEY=

# Email (optional)
RESEND_API_KEY=
EMAIL_FROM=

# Turnstile (optional)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
```

```bash
npm run dev
# → http://localhost:3000
```

### Build

```bash
npm run build
```

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` → automatic deploy.

Set the environment variables above in your Vercel project settings. Only the Supabase and Stripe variables are required — the rest enable optional features.

## Why Open Source?

I'm a product engineer. That means I don't just write code — I design the system, build the UI, wire the payments, automate the emails, and ship the whole thing. This repo is proof of that.

If you're hiring someone who can own an entire product from zero to production, **you're looking at the portfolio**.

---

<div align="center">

**[jamiegray.net](https://www.jamiegray.net)** · **[X](https://x.com/jamiegraytech)** · **[LinkedIn](https://linkedin.com/in/jamiegraytech)** · **[GitHub](https://github.com/sirjamesgray)**

</div>

## License

MIT
