import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { existsSync } from "node:fs";

const out = await build({ entryPoints: ["lib/section-routes.ts"], bundle: true, format: "esm", write: false, platform: "node" });
const mod = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));

test("old anchors map to real pages", () => {
  assert.equal(mod.routeForHash("#work"), "/work");
  assert.equal(mod.routeForHash("#turbo"), "/work#turbo");
  assert.equal(mod.routeForHash("#lab"), "/lab");
  assert.equal(mod.routeForHash("#experience"), "/about");
  assert.equal(mod.routeForHash("#contact"), "/contact");
  assert.equal(mod.routeForHash("#work-card-wewrite"), "/work#work-card-wewrite");
  assert.equal(mod.routeForHash("#nope"), null);
  assert.equal(mod.routeForHash(""), null);
});

test("every mapped route has a page", () => {
  for (const route of new Set(Object.values(mod.SECTION_ROUTES))) {
    const path = route.split("#")[0];
    assert.ok(existsSync(`app${path}/page.tsx`), `missing app${path}/page.tsx`);
  }
});
