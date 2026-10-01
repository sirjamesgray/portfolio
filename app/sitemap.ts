import type { MetadataRoute } from "next";
import { WORK_ENTRIES } from "@/lib/work-catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.jamiegray.net";
  const paths = ["", "/experience", "/contact", "/projects", "/for-recruiters", ...WORK_ENTRIES.map((entry) => `/work/${entry.slug}`)];

  return paths.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly",
    priority: path.startsWith("/work/") ? 0.7 : 1,
  }));
}
