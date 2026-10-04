// Sell form test against a running build, EN and FR (Playwright Chromium).
//   BASE_URL=http://localhost:3112 npm run check:forms
// For each language:
//   options   Department offers Mixed / Mixte, Category offers Wholesale lot / Lot de gros
//   empty     submitting empty marks all 5 fields aria-invalid, shows each error (linked by
//             aria-describedby), announces the summary in the live region, focuses the first field
//   valid     a valid submit opens a new tab on wa.me/<number> whose decoded text matches the
//             template exactly (wa.me itself is stubbed, nothing leaves the machine)
//   blocked   with popups blocked, the visible "Open WhatsApp" fallback carries the same URL
// The expected messages are written out here from the brief, independently of the site code.
import { chromium } from "playwright";
import { BASE_URL } from "./lib/site.mjs";

const NUMBER = "41768295628";
const NL = String.fromCharCode(10);
const CASES = [
  {
    path: "/sell",
    mixed: "Mixed",
    wholesale: "Wholesale lot",
    fallback: "Open WhatsApp",
    summary: "Some fields need your attention.",
    input: { name: "Camille Durand", contact: "+33 6 12 34 56 78", department: "Men", category: "Wholesale lot", description: "Twelve vintage polo shirts, sizes M and L, very good condition." },
    expected: [
      "Hello Polo Brokers, I would like to sell to you.",
      "Name: Camille Durand",
      "Contact: +33 6 12 34 56 78",
      "Department: Men",
      "Category: Wholesale lot",
      "Details: Twelve vintage polo shirts, sizes M and L, very good condition.",
      "I will send photos in this chat.",
    ].join(NL),
  },
  {
    path: "/fr/sell",
    mixed: "Mixte",
    wholesale: "Lot de gros",
    fallback: "Ouvrir WhatsApp",
    summary: "Certains champs sont à compléter.",
    input: { name: "Hélène Lefèvre", contact: "helene@example.com", department: "Femmes", category: "Maille", description: "Deux pulls torsadés vintage, taille S, très bon état." },
    expected: [
      "Bonjour Polo Brokers, je souhaite vous vendre des pièces.",
      "Nom : Hélène Lefèvre",
      "Contact : helene@example.com",
      "Rayon : Femmes",
      "Catégorie : Maille",
      "Détails : Deux pulls torsadés vintage, taille S, très bon état.",
      "J'envoie les photos dans cette conversation.",
    ].join(NL),
  },
];

const failures = [];
const samples = [];
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
  await context.route("https://wa.me/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<title>wa.me stub</title>" }));

  const fill = async (page, input) => {
    await page.fill("#sell-name", input.name);
    await page.fill("#sell-contact", input.contact);
    await page.selectOption("#sell-department", { label: input.department });
    await page.selectOption("#sell-category", { label: input.category });
    await page.fill("#sell-description", input.description);
  };

  for (const c of CASES) {
    const fail = (check, msg) => failures.push(`${check.padEnd(8)} ${c.path}  ${msg}`);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(BASE_URL + c.path, { waitUntil: "networkidle" });

    // options
    const departments = await page.locator("#sell-department option").allTextContents();
    const categories = await page.locator("#sell-category option").allTextContents();
    if (!departments.includes(c.mixed)) fail("options", `no "${c.mixed}" in Department (${departments.join(", ")})`);
    if (!categories.includes(c.wholesale)) fail("options", `no "${c.wholesale}" in Category`);

    // empty
    await page.click('form button[type="submit"]');
    await page.waitForTimeout(150);
    const empty = await page.evaluate(() => {
      const fields = [...document.querySelectorAll("form [name]")];
      return {
        invalid: fields.filter((f) => f.getAttribute("aria-invalid") === "true").length,
        described: fields.filter((f) => {
          const id = f.getAttribute("aria-describedby");
          const el = id && document.getElementById(id);
          return el && el.textContent.trim() && el.getBoundingClientRect().height > 0;
        }).length,
        focused: document.activeElement?.id,
        live: document.querySelector("form [aria-live]")?.textContent.trim(),
      };
    });
    if (empty.invalid !== 5) fail("empty", `${empty.invalid} of 5 fields aria-invalid`);
    if (empty.described !== 5) fail("empty", `${empty.described} of 5 fields have a visible error linked by aria-describedby`);
    if (empty.focused !== "sell-name") fail("empty", `focus on #${empty.focused}, expected #sell-name`);
    if (empty.live !== c.summary) fail("empty", `live region says "${empty.live}"`);

    // valid
    await fill(page, c.input);
    const [popup] = await Promise.all([page.waitForEvent("popup"), page.click('form button[type="submit"]')]);
    await popup.waitForURL((url) => url.hostname === "wa.me", { timeout: 5000 }).catch(() => {});
    const url = new URL(popup.url());
    const raw = popup.url().split("?text=")[1] || "";
    const text = decodeURIComponent(raw);
    if (url.hostname !== "wa.me" || url.pathname !== `/${NUMBER}`) fail("valid", `opened ${popup.url().slice(0, 60)}`);
    if (text !== c.expected) fail("valid", `decoded text differs:${NL}${text}${NL}expected:${NL}${c.expected}`);
    if (await page.locator('form [aria-invalid="true"]').count()) fail("valid", "errors still shown after a valid submit");
    if (!(await popup.evaluate(() => window.opener === null))) fail("valid", "WhatsApp tab keeps a reference to the opener");
    samples.push(`${c.path}${NL}${text}`);
    await popup.close();

    // blocked
    const blocked = await context.newPage();
    await blocked.addInitScript(() => {
      window.open = () => null;
    });
    await blocked.goto(BASE_URL + c.path, { waitUntil: "networkidle" });
    await fill(blocked, c.input);
    await blocked.click('form button[type="submit"]');
    const link = blocked.getByRole("link", { name: c.fallback });
    try {
      await link.waitFor({ state: "visible", timeout: 3000 });
      // Compared decoded: the browser may re-encode characters such as the apostrophe in the tab URL.
      const href = (await link.getAttribute("href")) || "";
      if (!href.startsWith(`https://wa.me/${NUMBER}?text=`) || decodeURIComponent(href.split("?text=")[1] || "") !== text) {
        fail("blocked", "fallback link URL differs from the WhatsApp URL");
      }
      if ((await link.getAttribute("target")) !== "_blank") fail("blocked", "fallback link does not open a new tab");
    } catch {
      fail("blocked", `no visible "${c.fallback}" link when the popup is blocked`);
    }
    await blocked.close();
    if (errors.length) fail("errors", errors.join(" | "));
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(`Sell form · decoded WhatsApp text${NL}${samples.join(NL + NL)}`);
if (failures.length) {
  console.error(`${NL}check:forms FAILED (${failures.length})${NL}${failures.join(NL)}`);
  process.exit(1);
}
console.log(`${NL}check:forms ok · EN and FR · options, empty submit, valid submit, blocked popup`);
