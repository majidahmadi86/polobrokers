// Lighthouse (mobile, default throttling) against a running build. Report only, not part of verify:
// scores move with machine load, so they are read by a person, not gated.
//   BASE_URL=http://localhost:3112 npm run check:lighthouse          (Home, /sell, /privacy)
//   LH_PATHS=/,/fr/contact npm run check:lighthouse
// Uses Playwright's Chromium, launched by Playwright with a debugging port (chrome-launcher cannot
// spawn it on this Windows setup). Prints the four category scores per page, and every SEO or
// accessibility audit that is not passing.
import lighthouse from "lighthouse";
import { chromium } from "playwright";
import { BASE_URL } from "./lib/site.mjs";

const PATHS = process.env.LH_PATHS ? process.env.LH_PATHS.split(",") : ["/", "/sell", "/privacy"];
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

const PORT = Number(process.env.LH_PORT || 9333);
const browser = await chromium.launch({ args: [`--remote-debugging-port=${PORT}`] });
const rows = [];
const notes = [];
try {
  for (const path of PATHS) {
    const result = await lighthouse(BASE_URL + path, { port: PORT, output: "json", logLevel: "error", onlyCategories: CATEGORIES });
    const lhr = result.lhr;
    rows.push(`| ${path} | ${CATEGORIES.map((c) => Math.round((lhr.categories[c].score ?? 0) * 100)).join(" | ")} |`);
    for (const cat of ["accessibility", "seo"]) {
      for (const ref of lhr.categories[cat].auditRefs) {
        const audit = lhr.audits[ref.id];
        if (ref.weight > 0 && audit.score !== null && audit.score < 1) notes.push(`${path}  ${cat}: ${audit.id} · ${audit.title}`);
      }
    }
    for (const id of ["largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift"]) {
      notes.push(`${path}  ${id}: ${lhr.audits[id].displayValue}`);
    }
  }
} finally {
  await browser.close();
}

console.log(`Lighthouse mobile · ${BASE_URL}`);
console.log(`| page | ${CATEGORIES.join(" | ")} |`);
console.log(rows.join(String.fromCharCode(10)));
console.log(notes.join(String.fromCharCode(10)));
