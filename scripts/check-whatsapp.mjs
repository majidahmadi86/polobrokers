// WhatsApp entry points on phones: every way to reach WhatsApp must actually navigate there.
//   BASE_URL=https://polobrokers.com node scripts/check-whatsapp.mjs      (diagnose a live site)
//   BASE_URL=http://localhost:3112 npm run check:whatsapp                  (gate, in npm run verify)
// Runs WebKit with the iPhone profile and Chromium with the Pixel profile. wa.me and
// api.whatsapp.com are intercepted (stubbed), so no real chat ever opens. For each entry point it
// records the URL and whether the tap navigated there (same tab or a new tab), and fails on any
// entry point that did not, on a wrong number, or on a console error.
//   Home Sell button · /contact WhatsApp tile · footer link · drawer link · /sell form submit
import { chromium, devices, webkit } from "playwright";

const BASE_URL = (process.env.BASE_URL || "http://localhost:3112").replace(/[/]$/, "");
const NUMBER = "41768295628";
const NL = String.fromCharCode(10);
const isWa = (u) => /^https:[/][/](wa[.]me|api[.]whatsapp[.]com)[/]/.test(u);

const ENTRIES = [
  { name: "Home Sell button", path: "/", locate: (p) => p.locator("main section a[href*='wa.me']").first() },
  { name: "/contact Message us", path: "/contact", locate: (p) => p.locator("main a[href*='wa.me']").first() },
  { name: "footer WhatsApp", path: "/", locate: (p) => p.locator("body > footer a[href*='wa.me']").first() },
  {
    name: "drawer WhatsApp",
    path: "/",
    before: async (p) => {
      await p.click('button[aria-controls="site-drawer"]');
      await p.locator("#site-drawer").waitFor({ state: "visible" });
    },
    locate: (p) => p.locator("#site-drawer a[href*='wa.me']").first(),
  },
  {
    name: "/sell form submit",
    path: "/sell",
    before: async (p) => {
      // The submit button is inactive until the page script is ready (a real user sees that too).
      await p.locator('form button[type="submit"]:not([disabled])').waitFor({ timeout: 20000 });
      await p.fill("#sell-name", "Camille Durand");
      await p.fill("#sell-contact", "+33 6 12 34 56 78");
      await p.selectOption("#sell-department", { index: 1 });
      await p.selectOption("#sell-category", { index: 1 });
      await p.fill("#sell-description", "Two vintage polo shirts, size M, very good.");
    },
    locate: (p) => p.locator('form button[type="submit"]'),
  },
];

const results = [];
const failures = [];
for (const [label, type, device] of [
  ["iPhone WebKit", webkit, devices["iPhone 13"]],
  ["Pixel Chromium", chromium, devices["Pixel 7"]],
]) {
  const browser = await type.launch();
  try {
    for (const entry of ENTRIES) {
      const context = await browser.newContext({ ...device, reducedMotion: "reduce" });
      const reached = [];
      await context.route(/^https:[/][/](wa[.]me|api[.]whatsapp[.]com)[/].*/, (route) => {
        reached.push(route.request().url());
        return route.fulfill({ status: 200, contentType: "text/html", body: "<title>wa stub</title>" });
      });
      const page = await context.newPage();
      const errors = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(String(e)));
      let href = "";
      let outcome = "";
      try {
        await page.goto(BASE_URL + entry.path, { waitUntil: process.env.WA_WAIT || "load", timeout: 45000 });
        if (entry.before) await entry.before(page);
        const target = entry.locate(page);
        await target.scrollIntoViewIfNeeded();
        href = (await target.getAttribute("href")) || "(form submit)";
        const popup = context.waitForEvent("page", { timeout: 6000 }).catch(() => null);
        await target.tap({ timeout: 8000 });
        const newPage = await popup;
        await page.waitForTimeout(1500);
        const where = newPage ? newPage.url() : page.url();
        const all = [...reached, where].filter(isWa);
        const url = all[0] || "";
        const decoded = decodeURIComponent(url);
        if (!url) outcome = `NO NAVIGATION (page stayed on ${where})`;
        else if (!url.includes(NUMBER)) outcome = `WRONG NUMBER ${url.slice(0, 60)}`;
        else outcome = `ok ${newPage ? "new tab" : "same tab"} ${decoded.slice(0, 70).split(NL)[0]}`;
      } catch (err) {
        outcome = `ERROR ${(err.message || String(err)).split(NL)[0].slice(0, 90)}`;
      }
      const real = errors.filter((e) => !/wa stub|favicon/.test(e));
      if (real.length) outcome += ` · console: ${real[0].slice(0, 80)}`;
      results.push(`${label.padEnd(15)} ${entry.name.padEnd(20)} ${outcome}${href && !outcome.startsWith("ok") ? `  [href ${href.slice(0, 50)}]` : ""}`);
      if (!outcome.startsWith("ok") || real.length) failures.push(`${label} · ${entry.name}`);
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

console.log(`WhatsApp entry points · ${BASE_URL}${NL}${results.join(NL)}`);
if (failures.length) {
  console.error(`${NL}check:whatsapp FAILED (${failures.length})${NL}${failures.join(NL)}`);
  process.exit(1);
}
console.log(`${NL}check:whatsapp ok · 5 entry points on iPhone WebKit and Pixel Chromium`);
