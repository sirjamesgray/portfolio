/**
 * A small Markdown renderer for blog posts.
 * It supports headings, paragraphs, lists, block quotes, code blocks, links, bold, italic and inline code.
 * The input is trusted repo content. The renderer escapes all text.
 */

export type Frontmatter = Record<string, string | boolean>;

export function parseFrontmatter(source: string): { data: Frontmatter; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) return { data: {}, body: source };
  const data: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx < 1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    data[key] = value === "true" ? true : value === "false" ? false : value;
  }
  return { data, body: source.slice(match[0].length) };
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inline(text: string): string {
  const codes: string[] = [];
  let out = text.replace(/`([^`]+)`/g, (_, code: string) => {
    codes.push(`<code>${escapeHtml(code)}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  out = escapeHtml(out);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label: string, href: string) => {
    const safe = /^(https?:\/\/|\/|#|mailto:)/.test(href) ? href : "#";
    const external = safe.startsWith("http");
    return `<a href="${safe}"${external ? ' rel="noopener noreferrer"' : ""}>${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  return out.replace(/\u0000(\d+)\u0000/g, (_, i: string) => codes[Number(i)]);
}

export function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = /^```(\w*)/.exec(line);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      const lang = fence[1] ? ` data-lang="${escapeHtml(fence[1])}"` : "";
      html.push(`<pre${lang}><code>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = Math.max(2, heading[1].length);
      html.push(`<h${level} id="${slugifyHeading(heading[2])}">${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      html.push(`<blockquote><p>${inline(buf.join(" "))}</p></blockquote>`);
      continue;
    }
    const listMatch = /^(\s*)([-*]|\d+\.)\s+/.exec(line);
    if (listMatch) {
      const ordered = /\d/.test(listMatch[2]);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ""))}</li>`);
        i++;
      }
      const tag = ordered ? "ol" : "ul";
      html.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { html.push("<hr />"); i++; continue; }
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|>|\s*([-*]|\d+\.)\s)/.test(lines[i])) buf.push(lines[i++]);
    html.push(`<p>${inline(buf.join(" "))}</p>`);
  }
  return html.join("\n");
}

/** Decide if draft posts are visible. Drafts show outside production, or when BLOG_SHOW_DRAFTS is "true". */
export function shouldShowDrafts(env: Record<string, string | undefined>): boolean {
  if (env.BLOG_SHOW_DRAFTS === "true") return true;
  if (env.BLOG_SHOW_DRAFTS === "false") return false;
  return env.VERCEL_ENV !== "production";
}

export function readingMinutes(markdown: string): number {
  return Math.max(1, Math.round(markdown.split(/\s+/).filter(Boolean).length / 225));
}
