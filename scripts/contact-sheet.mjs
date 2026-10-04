// One composite contact sheet for a commit report, from a running build.
//   BASE_URL=http://localhost:3112 SHEET_SET=home SHEET=docs/reports/commit-02-sheet.png npm run sheet
// Sets:
//   foundation  home at 390 and 1440 in EN and FR, drawer open at 390, accent test, OG image (commit 01)
//   home        full homepage at 390 and 1440 in EN, and at 1440 in FR (commit 02)
//   inner       /about and /collection at 1440 EN, /sell at 390 EN with the error state, /sell at 1440 FR (commit 03)
//   info        /about at 1440 EN, /contact at 390 EN, /legal at 1440 FR, /privacy at 390 FR (commit 04)
//   feed        Home Follow section with the mock grid at 1440 and 390, /fr/collection at 1440 with the
//               grid (BASE_URL: a server with IG_MOCK=1), the Follow fallback at 390 (FALLBACK_URL:
//               a server without a feed) (commit 05)
//   details     /legal at 1440 EN, /fr/privacy at 390 (rights section included), /contact at 390 EN (commit 06a)
//   prose       /legal and /privacy side by side, both 1440 EN at the same scale (commit 07)
// Pages are captured with reduced motion, so the entry fade never hides a section.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { chromium } from "playwright";

const BASE_URL = (process.env.BASE_URL || "http://localhost:3112").replace(/[/]$/, "");
const SET = process.env.SHEET_SET || "home";
const OUT = process.env.SHEET || `docs/reports/sheet-${SET}.png`;
const ACCENTS = "Créée · même · à · ç · Œuvre · Été";

const browser = await chromium.launch();
try {
  const context = await browser.newContext({ deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await context.newPage();
  const grab = async (label, path, width, height, { full = false, before } = {}) => {
    await page.setViewportSize({ width, height });
    await page.goto(BASE_URL + path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    if (before) await before();
    if (full) {
      // Bring lazy images in before a full-page capture.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 30));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState("networkidle");
    }
    return { label, data: (await page.screenshot({ fullPage: full })).toString("base64") };
  };
  const tile = (s, w) => `<figure><img src="data:image/png;base64,${s.data}" style="width:${w}px"><figcaption>${s.label}</figcaption></figure>`;

  let title;
  let rows;
  if (SET === "foundation") {
    const en1440 = await grab("Home EN · 1440", "/", 1440, 900);
    const fr1440 = await grab("Home FR · 1440", "/fr", 1440, 900);
    const en390 = await grab("Home EN · 390", "/", 390, 844);
    const fr390 = await grab("Home FR · 390", "/fr", 390, 844);
    const drawer = await grab("Drawer open EN · 390", "/", 390, 844, {
      before: async () => {
        await page.click('button[aria-controls="site-drawer"]');
        await page.locator("#site-drawer").waitFor({ state: "visible" });
      },
    });
    // Accent test, drawn by the site's own next/font face (var(--font-display)).
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL + "/", { waitUntil: "networkidle" });
    const box = await page.evaluate((text) => {
      const el = document.createElement("div");
      el.style.cssText = "position:fixed;inset:0;z-index:99;background:#fffdf8;color:#12271f;padding:40px 48px;font-family:var(--font-display);font-weight:500";
      const label = (t) => `<div style="font:12px var(--font-body);letter-spacing:.14em;text-transform:uppercase;margin:28px 0 8px">${t}</div>`;
      el.innerHTML = `${label("Playfair Display 500 · hero size 8rem")}<div style="font-size:8rem;line-height:1.15">${text}</div>
        ${label("Playfair Display 500 · body size 16px")}<div style="font-size:16px">${text}</div>
        ${label("Libre Franklin 400 · body size 16px")}<div style="font:16px var(--font-body)">${text}</div>`;
      document.body.appendChild(el);
      return document.fonts.ready.then(() => Math.ceil(el.lastElementChild.getBoundingClientRect().bottom + 40));
    }, ACCENTS);
    const accent = { label: "Accent test", data: (await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: Math.min(900, box) } })).toString("base64") };
    const og = { label: "OG image · 1200 x 630 (EN and FR)", data: readFileSync("public/og/en.png").toString("base64") };
    title = "Polo Brokers · commit 01 · foundation";
    rows = [
      [tile(en1440, 900), tile(fr1440, 900)],
      [tile(en390, 300), tile(fr390, 300), tile(drawer, 300), tile(og, 860)],
      [tile(accent, 1820)],
    ];
  } else if (SET === "home") {
    const en390 = await grab("Home EN · 390 · full page", "/", 390, 844, { full: true });
    const en1440 = await grab("Home EN · 1440 · full page", "/", 1440, 900, { full: true });
    const fr1440 = await grab("Home FR · 1440 · full page", "/fr", 1440, 900, { full: true });
    title = "Polo Brokers · commit 02 · homepage";
    rows = [[tile(en390, 390), tile(en1440, 700), tile(fr1440, 700)]];
  } else if (SET === "inner") {
    const about = await grab("/about EN · 1440 · full page", "/about", 1440, 900, { full: true });
    const collection = await grab("/collection EN · 1440 · full page", "/collection", 1440, 900, { full: true });
    const sellErrors = await grab("/sell EN · 390 · empty submit (error state)", "/sell", 390, 844, {
      full: true,
      before: async () => {
        await page.click("form button[type=submit]");
        await page.waitForTimeout(200);
        await page.evaluate(() => window.scrollTo(0, 0));
      },
    });
    const sellFr = await grab("/fr/sell FR · 1440 · full page", "/fr/sell", 1440, 900, { full: true });
    title = "Polo Brokers · commit 03 · about, collection, sell";
    rows = [[tile(about, 640), tile(collection, 640), tile(sellErrors, 390), tile(sellFr, 640)]];
  } else if (SET === "info") {
    const about = await grab("/about EN · 1440 · full page", "/about", 1440, 900, { full: true });
    const contact = await grab("/contact EN · 390 · full page", "/contact", 390, 844, { full: true });
    const legal = await grab("/fr/legal FR · 1440 · full page", "/fr/legal", 1440, 900, { full: true });
    const privacy = await grab("/fr/privacy FR · 390 · full page", "/fr/privacy", 390, 844, { full: true });
    title = "Polo Brokers · commit 04 · about polish, contact, legal, privacy";
    rows = [[tile(about, 640), tile(contact, 390), tile(legal, 640), tile(privacy, 390)]];
  } else if (SET === "feed") {
    const FALLBACK_URL = (process.env.FALLBACK_URL || "").replace(/[/]$/, "");
    if (!FALLBACK_URL) throw new Error("SHEET_SET=feed needs FALLBACK_URL");
    // The Follow section only: the last section of the page.
    const follow = async (label, base, path, width) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + path, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator("main section").last();
      // Lazy tiles outside the viewport would be captured empty: load and decode them all first.
      await page.evaluate(() => Promise.all([...document.images].map((img) => ((img.loading = "eager"), img.decode().catch(() => {})))));
      await section.scrollIntoViewIfNeeded();
      await page.waitForLoadState("networkidle");
      return { label, data: (await section.screenshot()).toString("base64") };
    };
    const grid1440 = await follow("Home EN · 1440 · Follow with the mock grid", BASE_URL, "/", 1440);
    const grid390 = await follow("Home EN · 390 · Follow with the mock grid", BASE_URL, "/", 390);
    const collection = await grab("/fr/collection FR · 1440 · full page with the grid", "/fr/collection", 1440, 900, { full: true });
    const fallback = await follow("Home EN · 390 · Follow fallback (no feed)", FALLBACK_URL, "/", 390);
    title = "Polo Brokers · commit 05 · live Instagram feed (mock) and fallback";
    rows = [[tile(grid1440, 900), tile(grid390, 390), tile(fallback, 390)], [tile(collection, 640)]];
  } else if (SET === "details") {
    const legal = await grab("/legal EN · 1440 · full page", "/legal", 1440, 900, { full: true });
    const privacy = await grab("/fr/privacy FR · 390 · full page (Vos droits)", "/fr/privacy", 390, 844, { full: true });
    const contact = await grab("/contact EN · 390 · full page", "/contact", 390, 844, { full: true });
    title = "Polo Brokers · commit 06a · legal entity, Swiss number, Swiss data protection";
    rows = [[tile(legal, 760), tile(privacy, 390), tile(contact, 390)]];
  } else if (SET === "prose") {
    const legal = await grab("/legal EN · 1440 · full page", "/legal", 1440, 900, { full: true });
    const privacy = await grab("/privacy EN · 1440 · full page", "/privacy", 1440, 900, { full: true });
    title = "Polo Brokers · commit 07 · /legal and /privacy at the same viewport and scale";
    rows = [[tile(legal, 900), tile(privacy, 900)]];
  } else {
    throw new Error(`unknown SHEET_SET ${SET}`);
  }

  const html = `<!doctype html><html><head><style>
    body{margin:0;padding:32px;background:#e9e4d8;font:14px Arial,sans-serif;color:#12271f;width:max-content}
    h1{font-size:20px;margin:0 0 20px}
    .row{display:flex;gap:24px;align-items:flex-start;margin-bottom:24px}
    figure{margin:0;background:#fff;padding:10px;box-shadow:0 1px 3px #0002}
    figure img{display:block;border:1px solid #ccc}
    figcaption{margin-top:8px;font-size:13px}
  </style></head><body><h1>${title}</h1>${rows.map((r) => `<div class="row">${r.join("")}</div>`).join("")}</body></html>`;
  const sheet = await browser.newPage({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: 1 });
  await sheet.setContent(html);
  await sheet.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, await sheet.screenshot({ fullPage: true }));
  console.log(`contact sheet written to ${OUT}`);
} finally {
  await browser.close();
}
