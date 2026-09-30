export type WorkShot = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type PublicProduct = {
  id: string;
  index: string;
  name: string;
  role: string;
  place: string;
  dates: string;
  href?: string;
  hrefLabel?: string;
  summary: string;
  points: readonly string[];
  desktop?: WorkShot;
  fullPage?: WorkShot;
  mobile?: WorkShot;
};

export const PUBLIC_PRODUCTS: readonly PublicProduct[] = [
  {
    id: "wewrite",
    index: "01",
    name: "WeWrite",
    role: "Founder, Product Engineer",
    place: "Fort Worth",
    dates: "Mar 2025 — Present",
    href: "https://www.getwewrite.app",
    hrefLabel: "getwewrite.app",
    summary:
      "A social wiki where every page is a fundraiser. I design the product in code and ship it with AI coding agents, on the web and on iOS.",
    points: [
      "AI coding agents build the product with me, from interface to data layer.",
      "A unified color-token system and glass card components keep the UI consistent.",
      "A full JavaScript to TypeScript migration, plus an API layer in place of direct database calls.",
      "The same product runs on React Native and Expo for iOS.",
    ],
    desktop: {
      src: "/work/wewrite-desktop.webp",
      width: 1440,
      height: 900,
      alt: "WeWrite home on a laptop, with pages and a write button",
    },
    fullPage: {
      src: "/work/wewrite-full.webp",
      width: 1280,
      height: 9066,
      alt: "Full WeWrite page inside a laptop screen",
    },
    mobile: {
      src: "/work/wewrite-mobile.webp",
      width: 780,
      height: 1688,
      alt: "WeWrite on an iPhone",
    },
  },
  {
    id: "lucent-wash",
    index: "02",
    name: "Lucent Wash",
    role: "Co-Founder, Technical Director",
    place: "Fort Worth",
    dates: "Oct 2025 — Present",
    href: "https://lucentwash.com",
    hrefLabel: "lucentwash.com",
    summary:
      "The full digital system for a residential window-washing business. Customers book and pay. The crew runs the day from the same product.",
    points: [
      "Booking and instant quote flows for homeowners.",
      "Crew and sales scheduling, dispatch, and job tracking.",
      "A CRM with lead routing.",
      "Stripe deposits and invoicing, plus SMS reminders.",
    ],
    desktop: {
      src: "/work/lucent-desktop.webp",
      width: 1440,
      height: 900,
      alt: "Lucent Wash marketing site on a laptop",
    },
    fullPage: {
      src: "/work/lucent-full.webp",
      width: 1280,
      height: 7897,
      alt: "Full Lucent Wash page inside a laptop screen",
    },
    mobile: {
      src: "/work/lucent-mobile.webp",
      width: 780,
      height: 1688,
      alt: "Lucent Wash on an iPhone",
    },
  },
  {
    id: "worx4u",
    index: "03",
    name: "Worx4u",
    role: "Full Stack Developer",
    place: "Fort Worth · formerly Thigbe",
    dates: "Apr 2026 — Present",
    summary:
      "Day job. A utility operations platform, described in text only. No screenshots of customer or internal systems.",
    points: [
      "Full Stack Developer, Sep 2026 — present. Developer II, UI/UX (Product Engineer), Apr — Sep 2026.",
      "Production features used daily by customers and back-office agents, including Python services. AI-assisted development, with tests taken from real customer use.",
      "An interactive API platform for utility developers.",
      "Retail Electricity Provider signup flows in ORDS, APEX, and PL/SQL, and the move from APEX to React and Next.js.",
      "Backend Mirror: git-versioned backend artifacts so AI tools have accurate context.",
      "SSO and a deterministic local development environment across the suite.",
    ],
  },
] as const;

export type DesignStudy = {
  id: string;
  title: string;
  meta: string;
  summary: string;
  image?: WorkShot;
};

export const DESIGN_STUDIES: readonly DesignStudy[] = [
  {
    id: "ramp-vondy",
    title: "Ramp travel and Vondy",
    meta: "Turbo Design · 2024–2025",
    summary:
      "At Turbo I designed Ramp travel: flights, hotels, and car rental for a corporate expense product. At Vondy I designed engagement features and prototypes that supported an investor raise.",
    image: {
      src: "/work/case-ramp-vondy.webp",
      width: 1200,
      height: 810,
      alt: "Case study board for Ramp travel and Vondy, September 2024",
    },
  },
  {
    id: "whop",
    title: "Whop design system and iOS",
    meta: "Product Designer · 2023–2024",
    summary:
      "I redesigned navigation and flows, and moved a storefront toward an engagement product. The work includes a theme-ready color-token system, iOS, and web.",
    image: {
      src: "/work/case-whop.webp",
      width: 1200,
      height: 766,
      alt: "Whop design system and iOS case study, September 2024",
    },
  },
  {
    id: "wewrite-design",
    title: "WeWrite, early design",
    meta: "Case study · Sep 2024",
    summary:
      "An early case study for WeWrite, before the product shipped in code. The live product is above.",
    image: {
      src: "/work/case-wewrite.webp",
      width: 1200,
      height: 522,
      alt: "WeWrite case study board, September 2024",
    },
  },
];

export const PARKHUB_NOTE = {
  title: "ParkHub",
  meta: "Product Designer · Dallas · 2017–2023",
  summary:
    "Six years on parking operations. I designed business intelligence, operations management, and an iOS point-of-sale app. I helped reorganize the design system and mentored a junior designer. ParkHub was acquired by JustPark. There is no public image for this work.",
} as const;
