import { SITE_CONFIG, SOCIALS } from "@/lib/constants";

export type ResumeExperience = {
  company: string;
  role: string;
  context?: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: readonly string[];
};

/**
 * Canonical content for the generated resume. The initial content was migrated
 * from public/documents/resume.pdf; portfolio pages can consume this module as
 * the resume evolves.
 */
export const RESUME_DATA = {
  basics: {
    name: SITE_CONFIG.name,
    title: "Full-Stack Web Developer & Product Engineer",
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
    location: "Fort Worth, Texas",
    website: SITE_CONFIG.url,
    linkedin: SOCIALS.linkedin,
    github: SOCIALS.github,
    summary:
      "Product Engineer with 8 years of experience spanning product design and full-stack development for startups and growth-stage companies. Designs and ships production web applications across frontend, backend, APIs, and databases, pairing strong UX judgment with maintainable engineering. Uses AI-assisted workflows to move faster while preserving code quality, performance, and security.",
  },
  skills: [
    "Full-Stack Development",
    "Product Design",
    "UX & UI Design",
    "Design Systems",
    "API Design",
    "Prototyping",
    "Systems Thinking",
    "Project Management",
  ],
  tools: [
    "Next.js",
    "TypeScript",
    "Firebase",
    "Claude Code",
    "OpenCode",
    "Supabase",
    "Vercel",
    "Resend",
    "VS Code",
    "Figma",
    "Framer",
    "Linear",
    "Jira",
    "Confluence",
  ],
  experience: [
    {
      company: "Freelance",
      role: "Product Engineer",
      location: "Fort Worth",
      startDate: "Dec 2025",
      endDate: "Present",
      highlights: [
        "Design and ship full-stack web applications with Next.js, Supabase, and Vercel, using AI-assisted development workflows.",
        "Built Lucent Wash's marketing site and customer platform, including booking, scheduling, authentication, and automated SMS reminders.",
        "Delivered a new marketing site for Staged for Living, a locally owned home-decoration company.",
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
        "Build and ship product functionality for WeWrite, a social writing platform where every page can raise funds, using AI coding agents throughout development.",
        "Created internal dashboards for monitoring activation and feature adoption; designed transactional email templates and integrated Resend.",
        "Rebuilt the interface around user-customizable color tokens and a unified component system, improving visual consistency and theme support.",
        "Migrated JavaScript to type-safe TypeScript and introduced an API layer over Firebase to improve maintainability and scalability.",
      ],
    },
    {
      company: "Turbo Design",
      role: "Product Designer",
      context: "Agency",
      location: "NYC",
      startDate: "Aug 2024",
      endDate: "Mar 2025",
      highlights: [
        "Vondy — Designed engagement-focused product features and high-fidelity prototypes that helped support an investor raise.",
        "Ramp — Redesigned flight booking and created new hotel and car-rental experiences.",
        "Precision AI — Designed core UX flows for a seed-stage platform helping private-equity teams discover acquisition prospects related to existing portfolio companies.",
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
        "Redesigned core navigation and user flows, evolving Whop from a transactional storefront into an experience platform built around continued engagement with purchased products.",
        "Produced high-fidelity designs, user flows, and prototypes for key features across iOS and web.",
        "Created a theme-ready color-token system and streamlined the component library to improve consistency across the product.",
      ],
    },
    {
      company: "ParkHub",
      role: "Product Designer",
      context: "B2B",
      location: "Dallas",
      startDate: "Jun 2017",
      endDate: "Jan 2023",
      highlights: [
        "Designed business-intelligence and operations-management web applications, along with an iOS mobile point-of-sale product.",
        "Partnered with engineering, product, and marketing while reorganizing the design system to improve handoff and cross-team collaboration.",
        "Onboarded and mentored a junior designer contributing to new feature development.",
      ],
    },
  ] satisfies ResumeExperience[],
} as const;
