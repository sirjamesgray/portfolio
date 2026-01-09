# Jamie Gray - Portfolio & Client Management

A modern portfolio and client management platform built with Next.js 16. Features interactive UI components, fluid animations, and a complete client lifecycle management system from lead capture through project delivery and payment collection.

**See [SPEC.md](./SPEC.md) for detailed system specifications.**

## Tech Stack

### Core Framework
- **[Next.js 16](https://nextjs.org)** - React framework with App Router and Turbopack
- **[React 19](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com)** - Utility-first CSS framework

### Authentication & Backend
- **[@supabase/ssr](https://supabase.com/docs/guides/auth/server-side)** - Server-side Supabase auth
- **[@supabase/supabase-js](https://supabase.com/docs/reference/javascript)** - Supabase client library

### Payments & Scheduling
- **[Stripe](https://stripe.com)** - Invoice creation, payment collection, webhooks
- **[Calendly](https://calendly.com)** - Consultation scheduling with webhook integration

### Email
- **[Resend](https://resend.com)** - Transactional emails for customer and admin notifications

### UI Components

#### Magic UI Components
From [magicui.design](https://magicui.design):
- `landing-button` - Landing page CTA button with shimmer animation (default/primary/secondary variants)
- `blur-fade` - Fade-in animation with blur effect
- `bento-grid` - Responsive grid layout for cards
- `marquee` - Infinite scrolling marquee
- `dot-pattern` - Decorative dot pattern background
- `animated-gradient-text` - Gradient text with animation
- `ripple` - Ripple effect component
- `pulsating-button` - Button with pulse animation
- `interactive-hover-button` - Button with hover effects
- `grid-pattern` - Grid pattern background

#### shadcn/ui Components
From [ui.shadcn.com](https://ui.shadcn.com):
- `accordion` - Collapsible FAQ-style component
- `alert-dialog` - Confirmation dialogs with cancel/confirm actions
- `badge` - Status badge
- `button` - Base button component
- `card` - Card container with header, content, footer
- `checkbox` - Checkbox input
- `dialog` - Modal dialogs for content or forms
- `drawer` - Slide-up drawer (mobile-friendly)
- `dropdown-menu` - Dropdown menus with glassmorphic styling
- `input` - Text input field
- `label` - Form label
- `select` - Dropdown select component
- `slider` - Range slider
- `status-badge` - Status indicator (active/pending/inactive)
- `switch` - Toggle switch
- `table` - Data table with header, body, caption
- `textarea` - Multi-line text input

### Animation & Effects
- **[Framer Motion](https://www.framer.com/motion)** - Animation library
- **[@number-flow/react](https://number-flow.barvian.me/)** - Odometer-style animated number transitions
- **[@codaworks/react-glow](https://github.com/codaworks/react-glow)** - Cursor-following glow effects
- **[Lucide React](https://lucide.dev)** - Icon library
- **[lucide-animated](https://lucide-animated.com)** - Animated Lucide icons with ref-based control

### Theming
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark/light mode with system preference detection

## Custom Components

### `CursorGrid`
Interactive grid background with twinkling sparkle effects at intersections:
- Grid lines with cursor-following spotlight effect
- Dots at grid intersections that brighten as cursor approaches
- Random twinkling animation pattern - 3-8 dots twinkle simultaneously
- Smooth transitions for opacity and scale changes

Location: `components/cursor-grid.tsx`

### `ExperienceTimeline`
Vertical timeline showing work experience with:
- Alternating left/right cards on desktop
- Date range highlighting on hover
- Animated connecting lines
- Cursor-following glow effects on cards
- Dynamic current month display for ongoing roles

Location: `components/experience-timeline.tsx`

### `UIShowcase`
Two-row infinite scrolling marquee showcasing 20 interactive UI components with auto-triggering animations:
- Toggle switches (notifications, WiFi, dark mode with sun/moon icon swap)
- Sliders with smooth animated transitions (performance, volume)
- Progress indicators (download, sync, loader)
- Animated Lucide icons (bell, heart, zap, refresh, etc.)
- NumberFlow odometer-style number animations
- Like button with animated counter
- Badges with cycling highlights
- User status and security lock indicators
- Calendar and clock displays

Location: `components/ui-showcase.tsx`

### `ThemeToggle`
Animated theme toggle button that cycles through light/dark/system modes.

Location: `components/theme-toggle.tsx`

## Features

### Smooth Scroll Navigation
All anchor links use CSS `scroll-behavior: smooth` for animated page navigation instead of instant jumps.

### Social Links
Connect section with links to:
- [X (Twitter)](https://x.com/jamiegraytech)
- [LinkedIn](https://www.linkedin.com/in/jamiegraytech/)

### Back to Top
Floating button at the bottom of the page for quick navigation back to the top with hover animation.

## Client Management System

A complete client lifecycle management platform for freelance projects.

### Lead Capture
- **Start Project Flow:** 6-step questionnaire (project type, budget, timeline, description, consultation scheduling, contact info)
- **Calendly Integration:** Webhook captures invitee.created events and auto-creates projects
- **Smart Auth Detection:** Logged-in users skip contact info step, project auto-links to their account
- **Admin Notifications:** Email alerts sent to admin for new project submissions and Calendly bookings
- **Customer Emails:** Confirmation emails sent automatically with dashboard access links

### Quote & Invoice Management
- **Quotes:** Create, send, track (draft → sent → accepted/rejected/expired)
- **Invoices:** Stripe-integrated invoicing with Smart Retries for failed payments
- **Auto-Generation:** Accepted quotes automatically generate draft invoices

### Project Tracking
- **Status Flow:** consultation → quote_sent → quote_accepted → payment → development → delivered (or canceled)
- **Collaborative Requirements:** Rich text with version history
- **Project Assets:** Screenshots and images with upload/paste support
- **Deliverables:** GitHub/Vercel URLs visible to clients
- **Landing Page Publishing:** Publish completed projects as case studies on the public landing page

### Dashboards
- **Admin Dashboard:** Full project/contact/quote/invoice management with analytics
- **Client Dashboard:** Minimal view of their projects, quotes, invoices, and deliverables
- **Mirror Mode:** Admin can view as any client (with mutation warnings)

### Webhooks
- `POST /api/webhooks/stripe` - Payment status sync (invoice.paid, invoice.payment_failed, etc.)
- `POST /api/webhooks/calendly` - Meeting scheduling (invitee.created, invitee.canceled)

## Project Structure

```
├── app/
│   ├── page.tsx                    # Main landing page
│   ├── login/page.tsx              # OAuth login (GitHub, Google)
│   ├── auth/callback/route.ts      # OAuth callback handler
│   ├── start-project/              # Multi-step project questionnaire
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard router (admin vs client)
│   │   ├── admin/                  # Admin dashboard
│   │   │   ├── projects/           # Project management
│   │   │   ├── contacts/           # Contact management
│   │   │   └── workflow/           # Event workflow visualization
│   │   └── projects/               # Client project view
│   ├── api/
│   │   ├── projects/submit/        # Lead form submission
│   │   ├── quotes/                 # Quote management
│   │   ├── invoices/               # Invoice management
│   │   └── webhooks/
│   │       ├── stripe/             # Stripe payment events
│   │       └── calendly/           # Calendly scheduling events
│   └── layout.tsx                  # Root layout with providers
├── components/
│   ├── ui/                         # Reusable UI components
│   ├── cursor-grid.tsx             # Interactive grid background
│   ├── experience-timeline.tsx
│   ├── ui-showcase.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── constants.ts                # Site configuration + admin emails
│   ├── stripe.ts                   # Stripe client
│   └── supabase/
│       ├── client.ts               # Browser Supabase client
│       ├── server.ts               # Server Supabase client
│       ├── admin.ts                # Service role client (bypasses RLS)
│       └── middleware.ts           # Session handling
└── middleware.ts                   # Next.js middleware for auth
```

## Getting Started

### Prerequisites
- Node.js 20.9.0+ or Bun
- Supabase project (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/sirjamesgray/portfolio.git
cd portfolio

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_WEBHOOK_SECRET_LOCAL=whsec_...  # For local development

# Calendly (optional - for consultation scheduling)
CALENDLY_WEBHOOK_SIGNING_KEY=your_signing_key

# Resend (for email notifications)
RESEND_API_KEY=re_...
EMAIL_FROM=Jamie Gray <hello@jamiegray.net>
```

### Development

```bash
# Run with Bun runtime (recommended for Node.js < 20.9.0)
bun --bun run dev --port 3001

# Or with Node.js 20.9.0+
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the site.

### Build

```bash
bun run build
```

## Deployment

The site is deployed on [Vercel](https://vercel.com). Push to `main` to trigger automatic deployments.

Required environment variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CALENDLY_WEBHOOK_SIGNING_KEY` (if using Calendly)
- `RESEND_API_KEY`
- `EMAIL_FROM`

## Configuration

Site-wide configuration is centralized in `lib/constants.ts`:

```typescript
export const SITE_CONFIG = {
  name: "Jamie Gray",
  title: "Product Engineer",
  email: "contact@jamiegray.net",
  description: "...",
} as const;
```

## License

MIT
