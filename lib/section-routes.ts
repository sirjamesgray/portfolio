/** The old home page anchors and the page that now holds each section. */
export const SECTION_ROUTES: Record<string, string> = {
  work: "/work",
  turbo: "/work#turbo",
  lab: "/lab",
  experience: "/about",
  about: "/about",
  contact: "/contact",
  resume: "/resume",
  blog: "/blog",
  experiments: "/experiments",
};

/** Return the page for an old anchor such as "#work", or null. Work card anchors go to the work page. */
export function routeForHash(hash: string): string | null {
  const id = hash.replace(/^#/, "");
  if (!id) return null;
  if (id.startsWith("work-card-")) return `/work#${id}`;
  return SECTION_ROUTES[id] ?? null;
}
