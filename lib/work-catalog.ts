import {
  DESIGN_STUDIES,
  PARKHUB_NOTE,
  PUBLIC_PRODUCTS,
  TURBO,
  type WorkShot,
} from "@/lib/public-work";

export type WorkTone = "green" | "blue";

export type WorkCover = WorkShot & {
  position?: "top" | "center";
};

export type WorkEntry = {
  slug: string;
  name: string;
  /** Jamie's role on this work. */
  role: string;
  /** One existing line on what shipped. */
  shipped: string;
  /** Tools named in resume v32 or in the existing public copy for this work. */
  stack: readonly string[];
  line: string;
  dates: string;
  earns?: string;
  tone: WorkTone;
  description: string;
  cover?: WorkCover;
  section: "work" | "turbo";
};

const STACK: Record<string, readonly string[]> = {
  wewrite: ["TypeScript", "Firebase", "React Native", "Expo"],
  worx4u: ["Python", "ORDS", "APEX", "PL/SQL", "React", "Next.js"],
  ramp: ["Figma", "Framer"],
  vondy: ["Figma", "Framer"],
  "precision-ai": ["Figma", "Framer"],
  whop: ["iOS", "Web"],
  parkhub: ["iOS"],
};

const SHIPPED: Record<string, string> = {
  wewrite: "A social wiki where every page is a fundraiser.",
  "lucent-wash": "The full digital system for a residential window-washing business.",
  worx4u: "A utility operations platform, described in text only.",
  whop: "I redesigned navigation and flows, and moved a storefront toward an engagement product.",
  "wewrite-design": "An early case study for WeWrite, before the product shipped in code.",
  parkhub: "I designed business intelligence, operations management, and an iOS point-of-sale app.",
};

const products = PUBLIC_PRODUCTS.map((product, index): WorkEntry => ({
  slug: product.id,
  name: product.name,
  role: product.role,
  shipped: SHIPPED[product.id] ?? product.summary,
  stack: STACK[product.id] ?? [],
  line: product.role,
  dates: product.dates,
  earns: product.earns,
  tone: index % 2 === 0 ? "green" : "blue",
  description: product.summary,
  cover: product.desktop,
  section: "work",
}));

const clients = TURBO.clients.map((client, index): WorkEntry => ({
  slug: client.id,
  name: client.label,
  role: TURBO.role,
  shipped: client.summary,
  stack: STACK[client.id] ?? [],
  line: client.title,
  dates: client.dates,
  tone: index % 2 === 0 ? "green" : "blue",
  description: client.summary,
  cover: client.board ? { ...client.board, position: "top" } : undefined,
  section: "turbo",
}));

const studies = DESIGN_STUDIES.map((study, index): WorkEntry => ({
  slug: study.id,
  name: study.title,
  role: study.id === "whop" ? "Product Designer" : "Case study",
  shipped: SHIPPED[study.id] ?? study.summary,
  stack: STACK[study.id] ?? [],
  line: study.summary,
  dates: study.meta,
  tone: index % 2 === 0 ? "blue" : "green",
  description: study.summary,
  cover: study.image,
  section: "turbo",
}));

const parkhub: WorkEntry = {
  slug: "parkhub",
  name: PARKHUB_NOTE.title,
  role: "Product Designer",
  shipped: SHIPPED.parkhub,
  stack: STACK.parkhub,
  line: PARKHUB_NOTE.summary,
  dates: PARKHUB_NOTE.meta,
  tone: "green",
  description: PARKHUB_NOTE.summary,
  section: "turbo",
};

export const WORK_ENTRIES: readonly WorkEntry[] = [...products, ...clients, ...studies, parkhub];

export function workIn(section: WorkEntry["section"]): readonly WorkEntry[] {
  return WORK_ENTRIES.filter((entry) => entry.section === section);
}

export function getWork(slug: string): WorkEntry | undefined {
  return WORK_ENTRIES.find((entry) => entry.slug === slug);
}
