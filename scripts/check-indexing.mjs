// Indexing switch against a running build (PB_INDEXABLE, read at build time).
//   BASE_URL=... EXPECT_INDEXABLE=1|0 npm run check:indexing
//   1  robots.txt allows all and names the sitemap; no page carries a robots noindex
//   0  robots.txt disallows everything and names no sitemap; every page says noindex, nofollow
import { BASE_URL, ROUTES } from "./lib/site.mjs";

const NL = String.fromCharCode(10);
const indexable = process.env.EXPECT_INDEXABLE === "1";
const failures = [];

const robots = await (await fetch(`${BASE_URL}/robots.txt`)).text();
const lines = robots.split(NL).map((l) => l.trim().toLowerCase());
if (indexable) {
  if (!lines.includes("allow: /")) failures.push("robots.txt does not allow /");
  if (lines.includes("disallow: /")) failures.push("robots.txt disallows /");
  if (!lines.some((l) => l.startsWith("sitemap: https://polobrokers.com/sitemap.xml"))) failures.push("robots.txt names no sitemap");
} else {
  if (!lines.includes("disallow: /")) failures.push("robots.txt does not disallow /");
  if (lines.some((l) => l.startsWith("sitemap:"))) failures.push("robots.txt names a sitemap in a preview build");
}

for (const route of ROUTES) {
  const html = await (await fetch(BASE_URL + route.path)).text();
  const metas = [...html.matchAll(/<meta name="robots" content="([^"]+)"/g)].map((m) => m[1]);
  if (indexable && metas.some((c) => c.includes("noindex"))) failures.push(`${route.path} carries robots ${metas.join(" | ")}`);
  if (!indexable && !metas.some((c) => c.includes("noindex") && c.includes("nofollow"))) failures.push(`${route.path} has no robots noindex, nofollow`);
}

if (failures.length) {
  console.error(`check:indexing FAILED (expected ${indexable ? "indexable" : "preview, no-index"})${NL}${failures.join(NL)}`);
  process.exit(1);
}
console.log(`check:indexing ok · ${indexable ? "indexable: robots allow all + sitemap, no noindex" : "preview: Disallow: /, noindex, nofollow"} on ${ROUTES.length} routes`);
