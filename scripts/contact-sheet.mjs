// One composite contact sheet for the commit report, from a running build.
//   BASE_URL=http://localhost:3112 SHEET=docs/reports/commit-01-sheet.png npm run sheet
// Home at 390 and 1440 in EN and FR, the drawer open at 390, the accent test in the display font at
// hero and body size (rendered by the page's own self-hosted font), and the OG image.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { chromium } from "playwright";

const BASE_URL = (process.env.BASE_URL || "http://localhost:3112").replace(/[/]$/, "");
const OUT = process.env.SHEET || "docs/reports/commit-01-sheet.png";
const ACCENTS = "Créée · même · à · ç · Œuvre · Été";

const browser = await chromium.launch();
const shots = [];
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const grab = async (label, path, width, height, before) => {
    await page.setViewportSize({ width, height });
    await page.goto(BASE_URL + path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    if (before) await before();
    shots.push({ label, width, data: (await page.screenshot()).toString("base64") });
  };

  await grab("Home EN · 1440", "/", 1440, 900);
  await grab("Home FR · 1440", "/fr", 1440, 900);
  await grab("Home EN · 390", "/", 390, 844);
  await grab("Home FR · 390", "/fr", 390, 844);
  await grab("Drawer open EN · 390", "/", 390, 844, async () => {
    await page.click('button[aria-controls="site-drawer"]');
    await page.locator("#site-drawer").waitFor({ state: "visible" });
  });

  // Accent test, drawn by the site's own next/font face (var(--font-display)).
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + "/", { waitUntil: "networkidle" });
  const box = await page.evaluate((text) => {
    const el = document.createElement("div");
    el.id = "accent-test";
    el.style.cssText = "position:fixed;inset:0;z-index:99;background:#fffdf8;color:#12271f;padding:40px 48px;font-family:var(--font-display);font-weight:500";
    el.innerHTML = `<div style="font:12px var(--font-body);letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px">Playfair Display 500 · hero size 8rem</div>
      <div style="font-size:8rem;line-height:1.15">${text}</div>
      <div style="font:12px var(--font-body);letter-spacing:.14em;text-transform:uppercase;margin:28px 0 8px">Playfair Display 500 · body size 16px</div>
      <div style="font-size:16px">${text}</div>
      <div style="font:12px var(--font-body);letter-spacing:.14em;text-transform:uppercase;margin:28px 0 8px">Libre Franklin 400 · body size 16px</div>
      <div style="font:16px var(--font-body)">${text}</div>`;
    document.body.appendChild(el);
    return document.fonts.ready.then(() => {
      const faces = [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight}`);
      return { height: Math.ceil(el.lastElementChild.getBoundingClientRect().bottom + 40), faces };
    });
  }, ACCENTS);
  shots.push({ label: `Accent test · loaded faces: ${box.faces.join(", ")}`, width: 1440, data: (await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: Math.min(900, box.height) } })).toString("base64") });

  shots.push({ label: "OG image · 1200 x 630 (EN and FR)", width: 1200, data: readFileSync("public/og/en.png").toString("base64") });

  // Compose.
  const tile = (s, w) => `<figure><img src="data:image/png;base64,${s.data}" style="width:${w}px"><figcaption>${s.label}</figcaption></figure>`;
  const [en1440, fr1440, en390, fr390, drawer, accent, og] = shots;
  const html = `<!doctype html><html><head><style>
    body{margin:0;padding:32px;background:#e9e4d8;font:14px Arial,sans-serif;color:#12271f;width:1856px}
    h1{font-size:20px;margin:0 0 20px}
    .row{display:flex;gap:24px;align-items:flex-start;margin-bottom:24px}
    figure{margin:0;background:#fff;padding:10px;box-shadow:0 1px 3px #0002}
    figure img{display:block;border:1px solid #ccc}
    figcaption{margin-top:8px;font-size:13px}
  </style></head><body>
    <h1>Polo Brokers · commit 01 · foundation</h1>
    <div class="row">${tile(en1440, 900)}${tile(fr1440, 900)}</div>
    <div class="row">${tile(en390, 300)}${tile(fr390, 300)}${tile(drawer, 300)}${tile(og, 860)}</div>
    <div class="row">${tile(accent, 1820)}</div>
  </body></html>`;
  const sheet = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
  await sheet.setContent(html);
  await sheet.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, await sheet.screenshot({ fullPage: true }));
  console.log(`contact sheet written to ${OUT}`);
} finally {
  await browser.close();
}
