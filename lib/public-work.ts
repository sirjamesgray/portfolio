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
  /** Extra role lines when one job has more than one title. */
  titles?: readonly string[];
  summary: string;
  /** One line on who earns, drawn from the chapter copy. */
  earns?: string;
  points: readonly string[];
  /** Brand color for the chapter band. */
  accent?: string;
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
    accent: "#2599FF",
    summary:
      "A social wiki where every page is a fundraiser. I design the product in code and ship it with AI coding agents, on the web and on iOS.",
    earns: "Writers earn from readers. Every page is a fundraiser.",
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
    accent: "#0EA5E9",
    summary:
      "The full digital system for a residential window-washing business. Customers book and pay. The crew runs the day from the same product.",
    earns: "A local business runs bookings, deposits, and invoicing on its own system.",
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
    titles: [
      "Full Stack Developer · Sep 2026 — Present",
      "Developer II, UI/UX (Product Engineer) · Apr 2026 — Sep 2026",
    ],
    place: "Fort Worth · formerly Thigbe",
    dates: "Apr 2026 — Present",
    summary:
      "Day job. A utility operations platform, described in text only. No screenshots of customer or internal systems.",
    points: [
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

export type BoardShot = WorkShot & {
  /** Extra frames shown inside the lightbox. */
  details?: readonly WorkShot[];
};

export type TurboClient = {
  id: string;
  name: string;
  label: string;
  title: string;
  dates: string;
  logo: string;
  accent: string;
  summary: string;
  supporting: readonly string[];
  board?: BoardShot;
};

export const TURBO = {
  id: "turbo",
  name: "Turbo Design Agency",
  role: "Product Designer",
  place: "NYC",
  dates: "Jun 2024 – May 2025",
  logo: "/logos/turbo.png",
  accent: "#2E78F7",
  intro:
    "Turbo is a design agency in New York City. I worked there for nearly a year as a Product Designer, with three clients: Ramp, Vondy, and Precision AI.",
  tools: "Figma · Figma Prototypes · Framer · Origami",
  clients: [
    {
      id: "ramp",
      name: "Ramp",
      label: "Ramp · via Turbo Design",
      title: "Product Designer (Travel team), via Turbo Design · NYC",
      dates: "Aug 2024 – Mar 2025",
      logo: "/logos/ramp.png",
      accent: "#E1F03F",
      summary:
        "Improved hotel bookings, car rentals, and flight booking UX on the travel team for a corporate expense management platform.",
      supporting: [
        "Ramp is a corporate card management company. On the Travel team, Jamie improved existing functionality and built new functionality.",
        "Car Rentals: Ramp already had hotel and flight booking before Turbo was contracted. Jamie was asked to design car rentals: competitor research on popular car-rental booking flows, using Ramp's existing design system for a Ramp-native feel. Frames: list view v1 and suggestions, rental suggestions after booking a flight, map view, list view v2, and the success state.",
        "Trip Builder: a simple wizard to increase product stickiness and reduce off-platform bookings. Buying a departure and return flight automatically creates a trip, then hotels and car rentals are suggested for the same dates.",
      ],
      board: {
        src: "/work/case-ramp.webp",
        width: 1600,
        height: 2469,
        alt: "Ramp travel design board: car rentals and trip builder",
        details: [
          {
            src: "/work/case-ramp-car.webp",
            width: 1100,
            height: 3100,
            alt: "Ramp car rentals frames",
          },
          {
            src: "/work/case-ramp-trip.webp",
            width: 1100,
            height: 2983,
            alt: "Ramp trip builder frames",
          },
        ],
      },
    },
    {
      id: "vondy",
      name: "Vondy",
      label: "Vondy · via Turbo Design",
      title: "Product Designer, via Turbo Design · NYC",
      dates: "Feb 2025 – Apr 2025",
      logo: "/logos/vondy.png",
      accent: "#0E3DB9",
      summary:
        "Designed engagement-focused features and prototypes that supported an investor raise.",
      supporting: [
        "Vondy is a consumer AI website. Goals were to improve onboarding data collection and increase repeat visits by nudging users to invest time in projects instead of one-time chat generations.",
        "Projects-based approach: all chats converted into projects so users keep adding new chats and generations to a project. The board shows the sidebar before and after.",
        "Onboarding audit: explored grid, category selection, and Tinder-style cards for picking what the user likes. The team went with category selection, where background imagery changes with the selected category.",
      ],
      board: {
        src: "/work/case-vondy.webp",
        width: 2200,
        height: 1300,
        alt: "Vondy design board: onboarding audit and projects sidebar",
        details: [
          {
            src: "/work/case-vondy-onboarding.webp",
            width: 1800,
            height: 1396,
            alt: "Vondy onboarding audit",
          },
          {
            src: "/work/case-vondy-projects.webp",
            width: 1600,
            height: 1816,
            alt: "Vondy projects sidebar, before and after",
          },
        ],
      },
    },
    {
      id: "precision-ai",
      name: "Precision AI",
      label: "Precision AI · via Turbo Design",
      title: "Product Designer, via Turbo Design",
      dates: "Jun 2024 – May 2025",
      logo: "/logos/turbo.png",
      accent: "#2E78F7",
      summary: "Designed core UX flows for PE acquisition discovery.",
      supporting: [],
    },
  ] satisfies readonly TurboClient[],
} as const;

export const DESIGN_STUDIES: readonly DesignStudy[] = [
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
