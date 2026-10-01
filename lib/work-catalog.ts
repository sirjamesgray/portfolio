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
  line: string;
  dates: string;
  earns?: string;
  tone: WorkTone;
  description: string;
  cover?: WorkCover;
  section: "work" | "turbo";
};

const products = PUBLIC_PRODUCTS.map((product, index): WorkEntry => ({
  slug: product.id,
  name: product.name,
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
