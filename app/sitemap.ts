import type { MetadataRoute } from "next";
import { WORK_ENTRIES } from "@/lib/work-catalog";
import { getPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.jamiegray.net";
  const paths = ["", "/work", "/lab", "/experiments", "/about", "/resume", "/experience", "/contact", "/projects", "/for-recruiters", "/blog", ...getPosts().filter((post) => !post.draft).map((post) => `/blog/${post.slug}`), ...WORK_ENTRIES.map((entry) => `/work/${entry.slug}`)];

  return paths.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly",
    priority: path.startsWith("/work/") ? 0.7 : 1,
  }));
}
