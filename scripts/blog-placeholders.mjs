// Generate labeled placeholder PNG images for the draft blog posts. Run: node scripts/blog-placeholders.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const posts = {
  "building-internal-tools-with-ai-agents": ["Cover", "Example workflow diagram", "Example tool screen"],
  "from-product-designer-to-builder": ["Cover", "Example design to code flow"],
  "design-to-code-teardown": ["Cover", "Example component in design", "Example component in code"],
};

function svg(w, h, label, sub, accent) {
  const lines = [];
  for (let x = 0; x <= w; x += 40) lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#111" />`);
  for (let y = 0; y <= h; y += 40) lines.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#111" />`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="100%" height="100%" fill="#000"/>${lines.join("")}
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="none" stroke="${accent}" stroke-width="2"/>
  <text x="50%" y="46%" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="${Math.round(w / 14)}" fill="${accent}">PLACEHOLDER</text>
  <text x="50%" y="58%" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="${Math.round(w / 36)}" fill="#bbb">${sub}</text>
  <text x="50%" y="66%" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="${Math.round(w / 48)}" fill="#666">${label}. Example image only.</text>
</svg>`;
}

for (const [slug, names] of Object.entries(posts)) {
  mkdirSync(`public/blog/${slug}`, { recursive: true });
  for (const [i, name] of names.entries()) {
    const [w, h] = i === 0 ? [1200, 630] : [1600, 1000];
    const file = i === 0 ? "cover.png" : `figure-${i}.png`;
    await sharp(Buffer.from(svg(w, h, name, slug.replace(/-/g, " "), i % 2 ? "#70b8ff" : "#3dd68c"))).png().toFile(`public/blog/${slug}/${file}`);
  }
}
