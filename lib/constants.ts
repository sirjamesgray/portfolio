export const SITE_CONFIG = {
  name: "Jamie Gray",
  title: "Creative Technologist — Product Engineer",
  email: "contact@jamiegray.net",
  phone: "8173680224",
  url: "https://www.jamiegray.net",
  calendly: "https://calendly.com/jamie-gray-tech/30min",
  description:
    "Creative Technologist and Product Engineer with 8+ years shipping web apps. Expert in LLM-powered agentic workflows, full-stack development, and UX design.",
} as const;

// Centralized social media links
export const SOCIALS = {
  x: "https://x.com/jamiegraytech",
  linkedin: "https://www.linkedin.com/in/jamiegraytech/",
  github: "https://github.com/sirjamesgray",
} as const;

// Resume document path - upload your resume to public/documents/
export const RESUME_PATH = "/documents/resume.pdf" as const;

// =============================================================================
// LANDING PAGE CTA CONFIGURATION
// =============================================================================
// All CTAs for landing pages are centrally defined here.
// Change once, update everywhere.

export type LandingPageCTA = {
  primary: { text: string; href: string };
  secondary: { text: string; href: string };
};

/**
 * Product Engineer landing page - focused on getting hired
 */
export const PRODUCT_ENGINEER_CTA: LandingPageCTA = {
  primary: {
    text: "Say hi",
    href: "/contact",
  },
  secondary: {
    text: "Learn More",
    href: "#problem", // First content section after hero
  },
} as const;

/**
 * Book a Project (hire-for-projects) landing page - focused on client work
 */
export const BOOK_PROJECT_CTA: LandingPageCTA = {
  primary: {
    text: "Get started",
    href: "/project-consultation",
  },
  secondary: {
    text: "View pricing",
    href: "/pricing",
  },
} as const;

/**
 * Legacy CTA config - kept for backwards compatibility
 * @deprecated Use PRODUCT_ENGINEER_CTA or BOOK_PROJECT_CTA instead
 */
export const CTA_CONFIG = {
  dashboardEnabled: {
    text: "Start a project",
    href: "/login",
  },
  dashboardDisabled: {
    text: BOOK_PROJECT_CTA.primary.text,
    href: BOOK_PROJECT_CTA.primary.href,
  },
} as const;

// Admin emails for permission checks
// Security note: This is safe because:
// 1. Users must authenticate via Google OAuth - they can't fake an email
// 2. The check happens server-side in the dashboard layout
// 3. For a personal portfolio, this is simpler than a database role system
export const ADMIN_EMAILS = [
  "jamiegray2234@gmail.com",
] as const;

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email as typeof ADMIN_EMAILS[number]);
}

export type ExperiencePosition = {
  title: string;
  startDate: string;
  endDate: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  logo: string;
  /** Brand color for glow/hover effects (HSL format for CursorGlow) */
  brandColor: string;
  note?: string;
  positions?: ExperiencePosition[];
};

// Project types for the onboarding flow and project display
export const PROJECT_TYPES = {
  website: "Website",
  webapp: "Web App",
  other: "Other",
} as const;

export type ProjectType = keyof typeof PROJECT_TYPES;

export function formatProjectType(type: string | null): string {
  if (!type) return "Project";
  return PROJECT_TYPES[type as ProjectType] || type;
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: "Worx4u",
    role: "Full Stack Developer",
    location: "Fort Worth",
    startDate: "Apr 2026",
    endDate: "Present",
    logo: "",
    brandColor: "#6366F1",
    note: "Formerly Thigbe",
    positions: [
      { title: "Full Stack Developer", startDate: "Sep 2026", endDate: "Present" },
      { title: "Developer II, UI/UX (Product Engineer)", startDate: "Apr 2026", endDate: "Sep 2026" },
    ],
  },
  {
    company: "Lucent Wash",
    role: "Co-Founder, Technical Director",
    location: "Fort Worth",
    startDate: "Oct 2025",
    endDate: "Present",
    logo: "",
    brandColor: "#0EA5E9",
  },
  {
    company: "WeWrite",
    role: "Founder, Product Engineer",
    location: "Fort Worth",
    startDate: "Mar 2025",
    endDate: "Present",
    logo: "/logos/wewrite.png",
    brandColor: "#2599FF",
  },
  {
    company: "Turbo",
    role: "Product Designer",
    location: "NYC",
    startDate: "Jun 2024",
    endDate: "May 2025",
    logo: "/logos/turbo.png",
    brandColor: "#2E78F7",
    note: "Ramp, Vondy, Precision AI",
  },
  {
    company: "Ramp",
    role: "Product Designer (Travel team)",
    location: "NYC",
    startDate: "Aug 2024",
    endDate: "Mar 2025",
    logo: "/logos/ramp.png",
    brandColor: "#E1F03F",
    note: "Client · via Turbo Design",
  },
  {
    company: "Vondy",
    role: "Product Designer",
    location: "NYC",
    startDate: "Feb 2025",
    endDate: "Apr 2025",
    logo: "/logos/vondy.png",
    brandColor: "#0E3DB9",
    note: "Client · via Turbo Design",
  },
  {
    company: "Whop",
    role: "Product Designer",
    location: "NYC",
    startDate: "Jul 2023",
    endDate: "May 2024",
    logo: "/logos/whop.png",
    brandColor: "#F83E22",
  },
  {
    company: "ParkHub",
    role: "Product Designer",
    location: "Dallas",
    startDate: "Jun 2017",
    endDate: "Jan 2023",
    logo: "/logos/parkhub.png",
    brandColor: "#279B3C",
    note: "Acquired by JustPark",
  },
];
