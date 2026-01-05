export const SITE_CONFIG = {
  name: "Jamie Gray",
  title: "Product Engineer",
  email: "contact@jamiegray.net",
  calendly: "https://calendly.com/jamie-gray-tech/30min",
  description:
    "Product Engineer offering software solutions with 8 years of UX design experience. Production-grade prototyping and UX-led systems design.",
} as const;

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
