import { escapeHtml } from "@/lib/blog-markdown";
import { getPosts, SITE_URL } from "@/lib/blog";

export const dynamic = "force-static";

export function GET() {
  const items = getPosts()
    .map((post) => `    <item>
      <title>${escapeHtml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeHtml(post.description)}</description>
    </item>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jamie Gray Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Notes on building software, design to code, and working with AI agents.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
