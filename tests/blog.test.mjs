// Run with: npm test. esbuild bundles the TypeScript module for node:test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { buildSync } from "esbuild";

const out = buildSync({ entryPoints: ["lib/blog-markdown.ts"], bundle: true, format: "esm", write: false, platform: "node" });
const mod = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));

test("parses frontmatter", () => {
  const { data, body } = mod.parseFrontmatter('---\ntitle: "Hi"\ndraft: true\n---\nBody');
  assert.equal(data.title, "Hi");
  assert.equal(data.draft, true);
  assert.equal(body, "Body");
});

test("renders and escapes markdown", () => {
  const html = mod.renderMarkdown("## Title\n\nA **b** `<x>` [l](/a)\n\n- one\n- two");
  assert.match(html, /<h2 id="title">Title<\/h2>/);
  assert.match(html, /<strong>b<\/strong>/);
  assert.match(html, /<code>&lt;x&gt;<\/code>/);
  assert.match(html, /<ul><li>one<\/li><li>two<\/li><\/ul>/);
  assert.doesNotMatch(mod.renderMarkdown("[x](javascript:alert(1))"), /javascript:/);
});

test("draft visibility follows the env", () => {
  assert.equal(mod.shouldShowDrafts({ VERCEL_ENV: "production" }), false);
  assert.equal(mod.shouldShowDrafts({ VERCEL_ENV: "production", BLOG_SHOW_DRAFTS: "true" }), true);
  assert.equal(mod.shouldShowDrafts({ VERCEL_ENV: "preview" }), true);
  assert.equal(mod.shouldShowDrafts({}), true);
  assert.equal(mod.shouldShowDrafts({ BLOG_SHOW_DRAFTS: "false" }), false);
});

test("posts have no em dashes and starter posts are drafts", () => {
  for (const f of readdirSync("content/blog")) {
    const src = readFileSync(`content/blog/${f}`, "utf8");
    assert.ok(!src.includes("\u2014"), `${f} has an em dash`);
    assert.equal(mod.parseFrontmatter(src).data.draft, true);
  }
});

test("parses image lines with captions and sizes", () => {
  assert.deepEqual(mod.parseImageLine('![A cat](/a.png "A caption")'), { alt: "A cat", src: "/a.png", caption: "A caption", width: undefined, height: undefined });
  assert.deepEqual(mod.parseImageLine('![x](/b.jpg "Cap" =1600x900)'), { alt: "x", src: "/b.jpg", caption: "Cap", width: 1600, height: 900 });
  assert.equal(mod.parseImageLine("![x](/c.png)").caption, undefined);
  assert.equal(mod.parseImageLine("Text ![x](/c.png)"), null);
});

test("renders images as figures and requires a size", () => {
  const blocks = mod.renderBlocks('Intro\n![Alt](/a.png "Cap <b>")\nMore', () => ({ width: 10, height: 20 }));
  assert.equal(blocks.length, 3);
  assert.deepEqual(blocks[1], { type: "image", src: "/a.png", alt: "Alt", caption: "Cap <b>", width: 10, height: 20 });
  const html = mod.renderMarkdown('![A "q"](/a.png "Cap")', () => ({ width: 4, height: 3 }));
  assert.match(html, /<figure><img src="\/a.png" alt="A &quot;q&quot;" width="4" height="3" \/><figcaption>Cap<\/figcaption><\/figure>/);
  assert.throws(() => mod.renderBlocks("![x](https://e.com/a.png)", () => null), /width and height/);
  assert.equal(mod.renderBlocks("![x](https://e.com/a.png =8x6)")[0].width, 8);
});

test("reads PNG sizes from the placeholder files", () => {
  const size = mod.imageSizeFromBuffer(readFileSync("public/blog/design-to-code-teardown/cover.png"));
  assert.deepEqual(size, { width: 1200, height: 630 });
});
