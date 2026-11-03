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
