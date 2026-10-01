// Public product notes for the recruiter area.
// Only work Jamie states in public.

import { RecruiterProjectDetail } from "@/lib/recruiter-types"

export const RECRUITER_PROJECTS: RecruiterProjectDetail[] = [
  {
    id: "wewrite",
    title: "WeWrite",
    subtitle: "A social wiki where every page is a fundraiser",
    timeline: "Mar 2025 – Present",
    role: "Founder, Product Engineer",
    tags: ["Next.js", "TypeScript", "Firebase", "React Native", "Expo", "Stripe"],
    description:
      "WeWrite is a social wiki where every page is a fundraiser. I design the product in code and ship it with AI coding agents. The product is on the web and on iOS.",
    challenges: [
      "Keep a color-token system and glass card components consistent while the product moves fast",
      "Replace direct database calls with an API layer during a full JavaScript to TypeScript migration",
      "Share product behavior between the web app and a React Native / Expo iOS app",
    ],
    architecture: [
      "Next.js and TypeScript on the web, with Firebase behind an API layer",
      "AI coding agents used through the build, with the code as the source of truth",
      "React Native and Expo for iOS",
      "Stripe for page fundraising",
    ],
    impact:
      "A live consumer product with a shared design language, a typed codebase, and an iOS app.",
    links: {
      live: "https://www.getwewrite.app",
    },
  },
  {
    id: "lucent-wash",
    title: "Lucent Wash",
    subtitle: "Digital system for a residential window-washing business",
    timeline: "Oct 2025 – Present",
    role: "Co-Founder, Technical Director",
    tags: ["Next.js", "TypeScript", "Supabase", "Stripe", "SMS"],
    description:
      "Lucent Wash is the full digital infrastructure for a residential window-washing business. Customers get a quote and book. The crew and sales team run scheduling, dispatch, and follow-up from the same product.",
    challenges: [
      "Instant quotes that stay accurate for real houses",
      "One schedule for crew and sales, with dispatch and job tracking",
      "Deposits, invoices, and SMS reminders without a separate stack of tools",
    ],
    architecture: [
      "Next.js and TypeScript for the marketing site and the operations product",
      "Booking, CRM, lead routing, and job tracking in one system",
      "Stripe for deposits and invoicing",
      "SMS reminders for upcoming jobs",
    ],
    impact:
      "The business runs customer acquisition and daily operations in one product.",
    links: {
      live: "https://lucentwash.com",
    },
  },
  {
    id: "worx4u",
    title: "Worx4u (formerly Thigbe)",
    subtitle: "Utility operations platform. Text only. No screenshots.",
    timeline: "Apr 2026 – Present",
    role: "Full Stack Developer; earlier Developer II, UI/UX (Product Engineer)",
    tags: ["React", "Next.js", "TypeScript", "Python", "ORDS", "APEX", "PL/SQL"],
    description:
      "Worx4u is my day job. I ship production features for a utility operations platform used daily by customers and back-office agents. Two titles stack on this role: Full Stack Developer from Sep 2026, and Developer II, UI/UX (Product Engineer) from Apr 2026 to Sep 2026.",
    challenges: [
      "Signup flows for a Retail Electricity Provider in ORDS, APEX, and PL/SQL",
      "Move APEX surfaces to React and Next.js without breaking daily operations",
      "Give AI tools accurate backend context, and make local development deterministic",
    ],
    architecture: [
      "React, Next.js, and TypeScript on the front end, with Python services",
      "Interactive API platform for external utility developers",
      "Backend Mirror: git-versioned backend artifacts for AI context and traceability",
      "SSO and a deterministic local development environment",
    ],
    impact:
      "Customers and back-office agents use the platform every day. The API platform serves utility developers.",
    links: {},
  },
  {
    id: "turbo-design",
    title: "Turbo Design Agency",
    subtitle: "Ramp, Vondy, and Precision AI",
    timeline: "Jun 2024 – May 2025",
    role: "Product Designer · NYC",
    tags: ["Figma", "Figma Prototypes", "Framer", "Origami"],
    description:
      "Turbo is a design agency in New York City. I worked there for nearly a year as a Product Designer, with three clients: Ramp, Vondy, and Precision AI. Ramp: Improved hotel bookings, car rentals, and flight booking UX on the travel team for a corporate expense management platform. Vondy: Designed engagement-focused features and prototypes that supported an investor raise. Precision AI: Designed core UX flows for PE acquisition discovery.",
    challenges: [
      "Ramp, via Turbo Design (Aug 2024 – Mar 2025): hotel, car rental, and flight booking UX on the travel team",
      "Vondy, via Turbo Design (Feb 2025 – Apr 2025): engagement features and prototypes for an investor raise",
      "Precision AI, via Turbo Design: core UX flows for PE acquisition discovery",
    ],
    architecture: ["Figma", "Figma Prototypes", "Framer", "Origami"],
    impact: "Three client engagements at Turbo Design: Ramp, Vondy, and Precision AI.",
    links: {},
  },
  {
    id: "design-history",
    title: "Whop and ParkHub",
    subtitle: "Earlier product design",
    timeline: "2017 – 2024",
    role: "Product Designer",
    tags: ["Figma", "Design systems", "iOS"],
    description:
      "At Whop I built a design system and iOS and web flows. At ParkHub I designed operations software and an iOS point of sale.",
    challenges: [
      "Whop: turn a storefront into an engagement product and keep a theme-ready token system",
      "ParkHub: business intelligence, operations, and iOS point of sale for parking",
    ],
    architecture: [
      "Theme-ready color tokens at Whop",
      "Design-system reorganization at ParkHub, plus mentoring",
    ],
    impact: "ParkHub was acquired by JustPark.",
    links: {},
  },
]
