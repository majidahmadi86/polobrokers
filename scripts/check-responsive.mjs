// Responsive gate against a running build (next build + next start), Playwright Chromium + axe.
//   BASE_URL=http://localhost:3112 npm run check:responsive
// Every route in both languages at every width below. Fails on:
//   overflow   horizontal overflow of the page
//   overlap    two text boxes drawn over each other
//   image      text drawn over an image (img, video, background image) under a measured 4.5:1
//   axe        axe-core color-contrast violations
//   tap        an interactive target under 44 x 44 px (links inside running text are exempt, per WCAG)
//   console    console errors or uncaught page errors
// Then, at 390px on every route, the mobile drawer: opened, audited the same way (scoped to the
// drawer), focus trapped, Escape closes and gives focus back, body scroll locked without layout
// shift, aria-expanded kept in sync, and it closes on a route change.
// Finally both 404 pages: status 404, right html lang, inside the language tree's shell.
// Adapted from the Groupe Balzac gate (geometry checks, measured contrast), moved to Playwright.
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import sharp from "sharp";
import { BASE_URL, ROUTES } from "./lib/site.mjs";

const WIDTHS = [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920];
const CHECKS = ["overflow", "overlap", "image", "axe", "tap", "console"];
const DRAWER_CHECKS = ["overflow", "overlap", "image", "axe", "tap", "behaviour"];
const CONTRAST_MIN = 4.5;
const only = process.env.GATE_ONLY ? process.env.GATE_ONLY.split(",") : null;
const routes = ROUTES.filter((r) => !only || only.includes(r.path));

/** Browser side. Geometry audit of everything under rootSelector (the whole page by default). */
function audit(rootSelector) {
  const root = (rootSelector && document.querySelector(rootSelector)) || document.body;
  const doc = document.documentElement;
  const out = { overflow: [], overlap: [], tap: [], imageTargets: [] };
  const shown = (el) => {
    if (el.closest('[aria-hidden="true"]') && !el.closest("[data-gate-keep]")) return false;
    for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
      const cs = getComputedStyle(node);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
      // Visually hidden (sr-only, skip link until focused).
      if (cs.clip && cs.clip !== "auto" && cs.position === "absolute") return false;
    }
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const describe = (el) => {
    const text = (el.textContent || "").trim().replace(/ +/g, " ").slice(0, 30);
    return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${text ? ` "${text}"` : ""}`;
  };
  const parse = (value) => {
    const m = value.match(/rgba?[(]([^)]+)[)]/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  };

  if (doc.scrollWidth > doc.clientWidth) out.overflow.push(`page is ${doc.scrollWidth}px wide in ${doc.clientWidth}px`);

  // Text runs: one entry per text node, with its line boxes in viewport coordinates.
  const runs = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.textContent.trim() && n.parentElement && shown(n.parentElement) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()].filter((r) => r.width >= 1 && r.height >= 1);
    if (rects.length) runs.push({ el: node.parentElement, node, text: node.textContent.trim(), rects });
  }

  // Overlap: line boxes of two different text runs crossing each other.
  for (let i = 0; i < runs.length; i++) {
    for (let j = i + 1; j < runs.length; j++) {
      const a = runs[i];
      const b = runs[j];
      if (a.el === b.el) continue;
      let hit = null;
      for (const ra of a.rects) {
        for (const rb of b.rects) {
          const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
          const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
          if (w > 2 && h > 2) hit = `${Math.round(w)}x${Math.round(h)}`;
        }
      }
      if (hit) out.overlap.push(`"${a.text.slice(0, 24)}" and "${b.text.slice(0, 24)}" overlap by ${hit}px`);
    }
  }

  // Text over images: measured later against the rendered pixels.
  const images = [...document.querySelectorAll("img, video, picture, svg image, *")]
    .filter((el) => {
      if (el.tagName === "IMG" || el.tagName === "VIDEO" || el.tagName === "image") return shown(el);
      return getComputedStyle(el).backgroundImage.includes("url(") && shown(el);
    })
    .map((el) => el.getBoundingClientRect());
  for (const run of runs) {
    for (const [rectIndex, r] of run.rects.entries()) {
      const over = images.some((img) => Math.min(r.right, img.right) - Math.max(r.left, img.left) > 1 && Math.min(r.bottom, img.bottom) - Math.max(r.top, img.top) > 1);
      if (!over) continue;
      run.el.setAttribute("data-gate-text", "");
      // Located again at measuring time (scrolled into view), so only an address is kept here.
      const gateId = run.el.dataset.gateId || String(out.imageTargets.length);
      run.el.dataset.gateId = gateId;
      const nodeIndex = [...run.el.childNodes].indexOf(run.node);
      out.imageTargets.push({ label: run.text.slice(0, 30), color: parse(getComputedStyle(run.el).color), gateId, nodeIndex, rectIndex });
    }
  }

  // Tap targets.
  for (const el of root.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], summary')) {
    if (!shown(el)) continue;
    if (el.tagName === "A") {
      let parent = el.parentElement;
      while (parent && getComputedStyle(parent).display.startsWith("inline")) parent = parent.parentElement;
      const own = (el.textContent || "").trim();
      const around = (parent?.textContent || "").trim();
      const inText = parent && ["P", "DD", "TD", "FIGCAPTION", "BLOCKQUOTE", "LI"].includes(parent.tagName) && getComputedStyle(el).display === "inline";
      if (inText && around.length > own.length + 3) continue;
    }
    const r = el.getBoundingClientRect();
    if (r.width < 43.5 || r.height < 43.5) out.tap.push(`${describe(el)} is ${Math.round(r.width)}x${Math.round(r.height)}`);
  }
  return out;
}

const channel = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = (r, g, b) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** Text over images: hide the text, screenshot what is behind it, take the 5th percentile ratio. */
async function measureImageText(page, targets) {
  if (!targets.length) return [];
  const style = await page.addStyleTag({ content: "[data-gate-text]{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}" });
  const failures = [];
  try {
    for (const t of targets) {
      if (!t.color) continue;
      // Scroll the line into view and clip in viewport coordinates: a full-page capture resizes the
      // viewport and can move the layout out from under document coordinates.
      const box = await page.evaluate(({ gateId, nodeIndex, rectIndex }) => {
        const el = document.querySelector('[data-gate-id="' + gateId + '"]');
        el.scrollIntoView({ block: "center", inline: "nearest" });
        const range = document.createRange();
        range.selectNodeContents(el.childNodes[nodeIndex]);
        const r = [...range.getClientRects()].filter((x) => x.width >= 1 && x.height >= 1)[rectIndex];
        return r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null;
      }, t);
      if (!box) continue;
      const vp = page.viewportSize();
      const x = Math.max(0, Math.floor(box.x));
      const y = Math.max(0, Math.floor(box.y));
      const clip = { x, y, width: Math.max(2, Math.min(vp.width - x, Math.ceil(box.w))), height: Math.max(2, Math.min(vp.height - y, Math.ceil(box.h))) };
      const png = await page.screenshot({ clip });
      const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const [cr, cg, cb, ca] = t.color;
      const ratios = [];
      for (let i = 0; i < info.width * info.height; i++) {
        const br = data[i * 3];
        const bg = data[i * 3 + 1];
        const bb = data[i * 3 + 2];
        const fg = lum(ca * cr + (1 - ca) * br, ca * cg + (1 - ca) * bg, ca * cb + (1 - ca) * bb);
        const back = lum(br, bg, bb);
        ratios.push((Math.max(fg, back) + 0.05) / (Math.min(fg, back) + 0.05));
      }
      ratios.sort((a, b) => a - b);
      const ratio = ratios[Math.floor(ratios.length * 0.05)];
      if (ratio < CONTRAST_MIN) failures.push(`"${t.label}" over an image measures ${ratio.toFixed(2)}:1`);
    }
  } finally {
    await style.evaluate((node) => node.remove());
    await page.evaluate(() => {
      for (const el of document.querySelectorAll("[data-gate-text]")) {
        el.removeAttribute("data-gate-text");
        el.removeAttribute("data-gate-id");
      }
      window.scrollTo(0, 0);
    });
  }
  return failures;
}

async function axeContrast(page, include) {
  let builder = new AxeBuilder({ page }).withRules(["color-contrast"]);
  if (include) builder = builder.include(include);
  const result = await builder.analyze();
  return result.violations.flatMap((v) => v.nodes.map((n) => `${n.target.join(" ")}: ${n.failureSummary.split(String.fromCharCode(10)).slice(-1)[0].trim()}`));
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 60)))));
}

async function runAudits(page, scope) {
  const found = await page.evaluate(audit, scope || null);
  return {
    overflow: found.overflow,
    overlap: found.overlap,
    tap: found.tap,
    image: await measureImageText(page, found.imageTargets),
    axe: await axeContrast(page, scope),
  };
}

const browser = await chromium.launch();
const table = [];
const drawerTable = [];
const details = [];
let consoleErrors = [];

try {
  const context = await browser.newContext({ deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("console", (msg) => msg.type() === "error" && consoleErrors.push(msg.text()));
  page.on("pageerror", (err) => consoleErrors.push(String(err)));

  for (const route of routes) {
    const row = { path: route.path, counts: Object.fromEntries(CHECKS.map((c) => [c, 0])) };
    consoleErrors = [];
    await page.setViewportSize({ width: WIDTHS[0], height: 900 });
    await page.goto(BASE_URL + route.path, { waitUntil: "networkidle" });
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await settle(page);
      const found = await runAudits(page);
      found.console = width === WIDTHS[WIDTHS.length - 1] ? consoleErrors : [];
      for (const check of CHECKS) {
        if (found[check].length) {
          row.counts[check] += 1;
          for (const msg of found[check]) details.push(`${check.padEnd(9)} ${route.path} @${width}px  ${msg}`);
        }
      }
    }
    table.push(row);

    // Drawer at 390.
    const drow = { path: route.path, counts: Object.fromEntries(DRAWER_CHECKS.map((c) => [c, 0])) };
    const fail = (check, msg) => {
      drow.counts[check] += 1;
      details.push(`drawer:${check.padEnd(9)} ${route.path} @390px  ${msg}`);
    };
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL + route.path, { waitUntil: "networkidle" });
    await settle(page);
    const toggle = page.locator('button[aria-controls="site-drawer"]');
    const before = await page.evaluate(() => ({ cw: document.documentElement.clientWidth, header: document.querySelector("header").getBoundingClientRect().toJSON() }));
    if ((await toggle.getAttribute("aria-expanded")) !== "false") fail("behaviour", "toggle not aria-expanded=false while closed");
    await toggle.click();
    await page.locator("#site-drawer").waitFor({ state: "visible" });
    await settle(page);
    const opened = await page.evaluate(() => ({
      expanded: document.querySelector('button[aria-controls="site-drawer"]').getAttribute("aria-expanded"),
      overflow: getComputedStyle(document.body).overflow,
      focusInside: document.getElementById("site-drawer").contains(document.activeElement),
      cw: document.documentElement.clientWidth,
      header: document.querySelector("header").getBoundingClientRect().toJSON(),
    }));
    if (opened.expanded !== "true") fail("behaviour", "toggle not aria-expanded=true while open");
    if (opened.overflow !== "hidden") fail("behaviour", `body overflow is ${opened.overflow}, scroll not locked`);
    if (!opened.focusInside) fail("behaviour", "focus did not move into the drawer");
    if (opened.cw !== before.cw || Math.abs(opened.header.left - before.header.left) > 0.5 || Math.abs(opened.header.width - before.header.width) > 0.5) {
      fail("behaviour", `layout shift on open (width ${before.cw} to ${opened.cw})`);
    }
    const audited = await runAudits(page, "#site-drawer");
    for (const check of ["overflow", "overlap", "image", "axe", "tap"]) for (const msg of audited[check]) fail(check, msg);
    for (let i = 0; i < 24; i++) {
      await page.keyboard.press(i < 18 ? "Tab" : "Shift+Tab");
      if (!(await page.evaluate(() => document.getElementById("site-drawer").contains(document.activeElement)))) {
        fail("behaviour", `focus left the drawer after ${i + 1} tab presses`);
        break;
      }
    }
    await page.keyboard.press("Escape");
    await page.locator("#site-drawer").waitFor({ state: "hidden" });
    const closed = await page.evaluate(() => ({
      expanded: document.querySelector('button[aria-controls="site-drawer"]').getAttribute("aria-expanded"),
      overflow: document.body.style.overflow,
      focusOnToggle: document.activeElement === document.querySelector('button[aria-controls="site-drawer"]'),
    }));
    if (closed.expanded !== "false") fail("behaviour", "aria-expanded not false after Escape");
    if (closed.overflow) fail("behaviour", "scroll lock not released after Escape");
    if (!closed.focusOnToggle) fail("behaviour", "focus not returned to the menu button after Escape");
    // Route change closes it.
    await toggle.click();
    await page.locator("#site-drawer").waitFor({ state: "visible" });
    const link = page.locator('#site-drawer nav a:not([aria-current="page"])').first();
    const target = await link.getAttribute("href");
    await link.click();
    await page.waitForURL((url) => url.pathname === target);
    try {
      await page.locator("#site-drawer").waitFor({ state: "hidden", timeout: 3000 });
    } catch {
      fail("behaviour", `drawer still open after navigating to ${target}`);
    }
    drawerTable.push(drow);
  }

  // 404 in both trees, judged in the browser.
  const notFound = [];
  for (const [path, lang] of [["/gate-missing-page", "en"], ["/fr/gate-missing-page", "fr"]]) {
    const res = await page.goto(BASE_URL + path, { waitUntil: "networkidle" });
    const seen = await page.evaluate(() => ({ lang: document.documentElement.lang, h1: document.querySelector("h1")?.textContent || "", shell: !!document.querySelector("body > header") && !!document.querySelector("body > footer") }));
    const ok = res.status() === 404 && seen.lang === lang && seen.h1 && seen.shell;
    notFound.push(`${path}: ${res.status()} lang=${seen.lang} h1="${seen.h1}" shell=${seen.shell} ${ok ? "pass" : "FAIL"}`);
    if (!ok) details.push(`404       ${path}  status ${res.status()}, lang ${seen.lang}, h1 "${seen.h1}", shell ${seen.shell}`);
  }

  const cell = (n, of) => (n === 0 ? "pass" : `FAIL ${n}/${of}`);
  console.log(`Responsive gate · ${routes.length} routes x ${WIDTHS.length} widths (${WIDTHS.join(", ")})`);
  console.log(`| route | ${CHECKS.join(" | ")} |`);
  for (const row of table) console.log(`| ${row.path} | ${CHECKS.map((c) => cell(row.counts[c], WIDTHS.length)).join(" | ")} |`);
  console.log(`\nDrawer open at 390px`);
  console.log(`| route | ${DRAWER_CHECKS.join(" | ")} |`);
  for (const row of drawerTable) console.log(`| ${row.path} | ${DRAWER_CHECKS.map((c) => (row.counts[c] ? `FAIL ${row.counts[c]}` : "pass")).join(" | ")} |`);
  console.log(`\n404 pages\n${notFound.join(String.fromCharCode(10))}`);
} finally {
  await browser.close();
}

if (details.length) {
  const unique = [...new Set(details)];
  console.error(`\ncheck:responsive FAILED (${unique.length})\n${unique.slice(0, 80).join(String.fromCharCode(10))}`);
  process.exit(1);
}
console.log("\ncheck:responsive ok");
