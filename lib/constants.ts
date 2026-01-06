export const SITE_CONFIG = {
  name: "Jamie Gray",
  title: "Product Engineer",
  email: "contact@jamiegray.net",
  url: "https://www.jamiegray.net",
  calendly: "https://calendly.com/jamie-gray-tech/30min",
  description:
    "Product Engineer offering software solutions with 8 years of UX design experience. Production-grade prototyping and UX-led systems design.",
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

// Get current month and year for dynamic end date
const getCurrentDate = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
};

export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  logo: string;
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
    company: "WeWrite",
    role: "Product Engineer",
    location: "DFW",
    startDate: "May 2025",
    endDate: getCurrentDate(),
    logo: "/logos/wewrite.png",
  },
  {
    company: "Turbo",
    role: "Product Designer",
    location: "NYC",
    startDate: "Jun 2024",
    endDate: "May 2025",
    logo: "/logos/turbo.png",
  },
  {
    company: "Ramp",
    role: "Product Designer",
    location: "NYC",
    startDate: "Aug 2024",
    endDate: "Mar 2025",
    logo: "/logos/ramp.png",
  },
  {
    company: "Vondy",
    role: "Product Designer",
    location: "NYC",
    startDate: "Feb 2025",
    endDate: "Apr 2025",
    logo: "/logos/vondy.png",
  },
  {
    company: "Whop",
    role: "Product Designer",
    location: "NYC",
    startDate: "Jul 2023",
    endDate: "May 2024",
    logo: "/logos/whop.png",
  },
  {
    company: "Saturday App",
    role: "Product Designer",
    location: "NYC",
    startDate: "Jan 2023",
    endDate: "Mar 2023",
    logo: "/logos/saturday.png",
  },
  {
    company: "ParkHub",
    role: "Product Designer",
    location: "DFW",
    startDate: "Jun 2017",
    endDate: "Jan 2023",
    logo: "/logos/parkhub.png",
  },
];
