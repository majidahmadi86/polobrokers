// Link crawl against a running build (next build + next start).
//   BASE_URL=http://localhost:3112 npm run check:links
// Crawls from / and /fr. Fails when an internal link (a[href], link[href], og:image) does not answer
// 200, when a page's html lang does not match its tree, when a sitemap URL is not a crawled page, or
// when an unknown path does not answer 404. External links are listed, never fetched.
// SEO basics per page: exactly one h1, a canonical to itself, hreflang en / fr / x-default (x-default
// is EN) pointing at the matching page of each language.
import { BASE_URL, ROUTES, langOf } from "./lib/site.mjs";

const SITE_URL = "https://polobrokers.com";
const failures = [];
const external = new Set();
const checked = new Map();
const pages = new Set();
const queue = ["/", "/fr"];

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"))?.[1];
const decode = (s) => s.replace(/&amp;/g, "&");

function internalPath(raw) {
  const href = decode(raw);
  if (/^(mailto:|tel:|#|javascript:)/i.test(href)) return null;
  if (href.startsWith(SITE_URL)) return href.slice(SITE_URL.length) || "/";
  if (/^https?:\/\//i.test(href)) {
    external.add(href);
    return null;
  }
  return href.startsWith("/") ? href : null;
}

async function status(path) {
  if (!checked.has(path)) {
    const res = await fetch(BASE_URL + path, { redirect: "manual" });
    checked.set(path, { code: res.status, type: res.headers.get("content-type") || "", body: res.status === 200 ? await res.text() : "" });
  }
  return checked.get(path);
}

while (queue.length) {
  const path = queue.shift();
  if (pages.has(path)) continue;
  pages.add(path);
  const { code, body } = await status(path);
  if (code !== 200) {
    failures.push(`status ${code}  ${path}`);
    continue;
  }
  const lang = body.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
  if (lang !== langOf(path)) failures.push(`lang   ${path} has html lang="${lang}", expected "${langOf(path)}"`);

  // SEO basics, read from the server HTML (the RSC payload never contains a literal <h1 tag).
  const h1s = (body.match(/<h1[ >]/g) || []).length;
  if (h1s !== 1) failures.push(`h1     ${path} has ${h1s} h1 elements`);
  const bare = langOf(path) === "fr" ? path.slice(3) || "/" : path;
  const expected = { en: bare, fr: bare === "/" ? "/fr" : `/fr${bare}`, "x-default": bare };
  // The root is written without its trailing slash (https://polobrokers.com): the same URL.
  const norm = (u) => (u && u.endsWith("/") ? u.slice(0, -1) : u);
  const canonical = body.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (norm(canonical) !== norm(SITE_URL + path)) failures.push(`canon  ${path} canonical is ${canonical}`);
  for (const [hreflang, target] of Object.entries(expected)) {
    const href = body.match(new RegExp(`<link rel="alternate" hrefLang="${hreflang}" href="([^"]+)"`))?.[1];
    if (norm(href) !== norm(SITE_URL + target)) failures.push(`hreflang ${path} ${hreflang} is ${href}, expected ${SITE_URL + target}`);
  }

  const anchors = [...body.matchAll(/<a\s[^>]*>/gi)].map((m) => m[0]);
  for (const tag of anchors) {
    const href = attr(tag, "href");
    if (!href) continue;
    if (/^https?:\/\//i.test(href) && !href.startsWith(SITE_URL)) {
      if (attr(tag, "target") !== "_blank" || !/noopener/.test(attr(tag, "rel") || "") || !/noreferrer/.test(attr(tag, "rel") || "")) {
        failures.push(`extern ${path} links ${href} without target=_blank rel="noopener noreferrer"`);
      }
    }
    const target = internalPath(href);
    if (target) {
      const clean = target.split("#")[0] || "/";
      if (!pages.has(clean)) queue.push(clean);
    }
  }
  // Resources the page points at: icons, canonical/alternates (pages), og:image.
  for (const tag of [...body.matchAll(/<link\s[^>]*>/gi)].map((m) => m[0])) {
    const rel = attr(tag, "rel") || "";
    const href = attr(tag, "href");
    if (!href || /preload|stylesheet|modulepreload/.test(rel)) continue;
    const target = internalPath(href);
    if (!target) continue;
    if (/canonical|alternate/.test(rel)) {
      if (!pages.has(target)) queue.push(target);
    } else {
      const { code: c } = await status(target);
      if (c !== 200) failures.push(`status ${c}  ${target} (link rel=${rel} on ${path})`);
    }
  }
  for (const m of body.matchAll(/<meta property="og:image" content="([^"]+)"/g)) {
    const target = internalPath(m[1]);
    if (!target) continue;
    const { code: c, type } = await status(target);
    if (c !== 200 || !type.startsWith("image/")) failures.push(`og     ${target} on ${path} answered ${c} ${type}`);
  }
}

// Every route must have been reached by the crawl, and the sitemap must list exactly the routes.
for (const route of ROUTES) if (!pages.has(route.path)) failures.push(`orphan ${route.path} is not linked from the crawl`);
const sitemap = (await status("/sitemap.xml")).body;
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => internalPath(m[1]));
if (locs.length !== ROUTES.length) failures.push(`sitemap lists ${locs.length} URLs, expected ${ROUTES.length}`);
for (const loc of locs) if (!ROUTES.some((r) => r.path === loc)) failures.push(`sitemap lists unknown ${loc}`);
if ((await status("/robots.txt")).code !== 200) failures.push("robots.txt does not answer 200");

// Unknown paths answer 404 in both trees.
for (const path of ["/gate-missing-page", "/fr/gate-missing-page"]) {
  const res = await fetch(BASE_URL + path);
  if (res.status !== 404) failures.push(`404    ${path} answered ${res.status}`);
}

console.log(`Crawled ${pages.size} pages, ${checked.size} internal URLs checked`);
console.log(`External links (not fetched):\n${[...external].sort().map((u) => `  ${u}`).join("\n") || "  none"}`);
if (failures.length) {
  console.error(`check:links FAILED (${failures.length})\n${failures.join("\n")}`);
  process.exit(1);
}
console.log("check:links ok");
