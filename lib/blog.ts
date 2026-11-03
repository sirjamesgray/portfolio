import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter, readingMinutes, renderMarkdown, shouldShowDrafts } from "@/lib/blog-markdown";

export const BLOG_DIR = path.join(process.cwd(), "content", "blog");
export const SITE_URL = "https://www.jamiegray.net";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  draft: boolean;
  tags: string[];
  minutes: number;
  html: string;
};

function load(file: string): BlogPost {
  const source = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, body } = parseFrontmatter(source);
  const slug = file.replace(/\.(md|mdx)$/, "");
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? "1970-01-01"),
    draft: data.draft === true,
    tags: String(data.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    minutes: readingMinutes(body),
    html: renderMarkdown(body),
  };
}

export function draftsVisible(): boolean {
  return shouldShowDrafts(process.env);
}

/** Return the visible posts, newest first. */
export function getPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const showDrafts = draftsVisible();
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.(md|mdx)$/.test(f))
    .map(load)
    .filter((p) => showDrafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): BlogPost | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function formatDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
