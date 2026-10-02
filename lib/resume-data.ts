import { SITE_CONFIG, SOCIALS } from "@/lib/constants";

export type ResumePosition = {
  title: string;
  startDate: string;
  endDate: string;
};

export type ResumeExperience = {
  company: string;
  role: string;
  context?: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: readonly string[];
  positions?: readonly ResumePosition[];
};

/**
 * Canonical content for the generated resume. Matches resume v32.
 */
export const RESUME_DATA = {
  basics: {
    name: SITE_CONFIG.name,
    title: "Creative Technologist — Product Engineer",
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
    location: "Fort Worth, Texas",
    website: SITE_CONFIG.url,
    linkedin: SOCIALS.linkedin,
    github: SOCIALS.github,
    summary:
      "Product engineer and creative technologist with 8+ years shipping web apps across startups, agencies, and enterprise. Combined strong UX judgment with full-stack engineering across frontend, backend, APIs, and databases. Expert in LLM-powered agentic workflows and cost-aware model routing via OpenRouter.",
  },
  skills: [
    "Product Design",
    "UX & UI Design",
    "Design Systems",
    "Prototyping & Wireframing",
    "Full-Stack Development",
    "Front-End Development",
    "API Design",
    "Technical Architecture",
    "Agentic AI Workflows",
    "Conversation Design",
    "Systems Thinking",
    "Product Strategy",
    "Customer Experience Strategy",
    "Accessible Design (WCAG)",
    "Project Management",
  ],
  tools: [
    "Hermes Agent",
    "OpenRouter",
    "Factory AI",
    "Codex",
    "Claude",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "PostgreSQL",
    "React Native",
    "Expo",
    "Supabase",
    "Firebase",
    "Vercel",
    "Playwright",
    "Stripe",
    "Figma",
    "Framer",
    "Linear",
    "Jira",
  ],
  experience: [
    {
      company: "Worx4u (formerly Thigbe)",
      role: "Full Stack Developer",
      context: "Enterprise",
      location: "Fort Worth",
      startDate: "Apr 2026",
      endDate: "Present",
      positions: [
        {
          title: "Full Stack Developer",
          startDate: "Sep 2026",
          endDate: "Present",
        },
        {
          title: "Developer II, UI/UX (Product Engineer)",
          startDate: "Apr 2026",
          endDate: "Sep 2026",
        },
      ],
      highlights: [
        "Ship front-end and back-end production features used daily by both customers and back-office agents, including Python services, using AI-assisted development with test workflows built from real customer use cases.",
        "Built an interactive API platform for external utility developers.",
        "Designed customer signup flows for a Retail Electricity Provider using ORDS, APEX, and PL/SQL.",
        "Created Backend Mirror: a git-versioned backend artifact representation for AI context and traceability.",
        "Drove identity management, SSO, and deterministic local dev environments across the product suite.",
      ],
    },
    {
      company: "Lucent Wash",
      role: "Co-Founder, Technical Director",
      context: "Consumer Services",
      location: "Fort Worth",
      startDate: "Oct 2025",
      endDate: "Present",
      highlights: [
        "Built the full customer platform — marketing site, booking, scheduling, auth, and SMS reminders.",
        "Designed end-to-end customer experience and established deployment pipeline and operational tooling.",
      ],
    },
    {
      company: "WeWrite, Inc.",
      role: "Founder",
      context: "Consumer Social",
      location: "Fort Worth",
      startDate: "Mar 2025",
      endDate: "Present",
      highlights: [
        "Built and shipped product for a social writing platform where pages raise funds, using AI coding agents throughout.",
        "Migrated JavaScript to TypeScript and introduced a Firebase API layer for maintainability and scalability.",
      ],
    },
    {
      company: "Turbo Design",
      role: "Product Designer",
      context: "Agency",
      location: "NYC",
      startDate: "Jun 2024",
      endDate: "May 2025",
      highlights: [
        "Ramp Business Corporation: Improved hotel bookings, car rentals, and flight booking UX on the travel team for a corporate expense management platform.",
        "Vondy: Designed engagement-focused features and prototypes that supported an investor raise.",
        "Precision AI: Designed core UX flows for PE acquisition discovery.",
      ],
    },
    {
      company: "Whop",
      role: "Product Designer",
      context: "Consumer Social",
      location: "NYC",
      startDate: "Jul 2023",
      endDate: "May 2024",
      highlights: [
        "Redesigned core navigation and user flows, evolving a transactional storefront into an engagement platform.",
        "Produced high-fidelity designs, user flows, and prototypes for iOS and web. Built a theme-ready color-token system.",
      ],
    },
    {
      company: "ParkHub",
      role: "Product Designer",
      context: "Enterprise (acquired by JustPark)",
      location: "Dallas",
      startDate: "Jun 2017",
      endDate: "Jan 2023",
      highlights: [
        "Designed BI, operations-management, and iOS POS applications for parking operations.",
        "Partnered cross-functionally to reorganize the design system. Mentored a junior designer.",
      ],
    },
  ] satisfies ResumeExperience[],
} as const;

/** Years phrase from RESUME_DATA.basics.summary. Resume v32. */
export const RESUME_YEARS = "8+ years";

/**
 * Core tools copied from RESUME_DATA.tools.
 * Resume v32. No tool is added.
 */
export const RESUME_CORE_STACK = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "PostgreSQL",
  "React Native",
  "Expo",
  "Supabase",
  "Firebase",
  "Stripe",
] as const;

/**
 * Proof lines copied from RESUME_DATA.experience highlights.
 * Resume v32.
 */
export const RESUME_PROOF = [
  "Built and shipped product for a social writing platform where pages raise funds, using AI coding agents throughout.",
  "Built the full customer platform — marketing site, booking, scheduling, auth, and SMS reminders.",
  "Built an interactive API platform for external utility developers.",
  "Ramp Business Corporation: Improved hotel bookings, car rentals, and flight booking UX on the travel team for a corporate expense management platform.",
  "Designed BI, operations-management, and iOS POS applications for parking operations.",
] as const;
