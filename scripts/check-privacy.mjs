// Privacy gate against a running build. Keeps the privacy policy true.
//   BASE_URL=http://localhost:3112 npm run check:privacy
// Loads all 14 routes in Chromium and fails if:
//   request   any request goes to a host other than the site's own origin (fonts, images, scripts,
//             beacons: everything must be served by the site itself)
//   cookie    any cookie is set
//   storage   localStorage or sessionStorage holds any key after load
// Each route is loaded in a fresh context, with motion allowed (the default visitor), then scrolled
// to the bottom so anything loaded late (lazy images, observers) is caught too. Following a link
// out to Instagram or WhatsApp is not a request made by the site and is not exercised here.
import { chromium } from "playwright";
import { BASE_URL, ROUTES } from "./lib/site.mjs";

const origin = new URL(BASE_URL).origin;
const failures = [];
let requests = 0;

const browser = await chromium.launch();
try {
  for (const route of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    page.on("request", (req) => {
      const url = req.url();
      if (url.startsWith("data:") || url.startsWith("blob:")) return;
      requests += 1;
      if (new URL(url).origin !== origin) failures.push(`request  ${route.path}  ${url.slice(0, 100)}`);
    });
    await page.goto(BASE_URL + route.path, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
    });
    await page.waitForLoadState("networkidle");
    const cookies = await context.cookies();
    for (const c of cookies) failures.push(`cookie   ${route.path}  ${c.name} (${c.domain})`);
    const storage = await page.evaluate(() => ({
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
    }));
    for (const key of storage.local) failures.push(`storage  ${route.path}  localStorage ${key}`);
    for (const key of storage.session) failures.push(`storage  ${route.path}  sessionStorage ${key}`);
    await context.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`check:privacy FAILED (${failures.length})`);
  console.error([...new Set(failures)].join(String.fromCharCode(10)));
  process.exit(1);
}
console.log(`check:privacy ok · ${ROUTES.length} routes, ${requests} requests, all to ${origin} · no cookies · no storage`);
