// Instagram feed against a running build: routes and rendering.
//   BASE_URL=... IG_EXPECT=grid|none IG_* (as given to the server) npm run check:ig-site
// Routes
//   connect   no key, wrong key: 404; right key: 302 to the Instagram authorize URL with client_id,
//             redirect_uri, response_type=code, scope=instagram_business_basic and a signed state
//   status    wrong key: 404; right key: the health JSON, never the token
//   callback  bad state: refused; a valid state for another account (stand-in Instagram on
//             IG_STANDIN_PORT): refused, nothing stored; for @polobrokers: connected, token.json
//             written (then removed again, so the run stays in its mode)
//   media     /ig-media refuses traversal and anything outside the whitelist
// Rendering (Home, /fr, /collection, /fr/collection)
//   grid      6 tiles, each a new-tab link with rel noopener noreferrer, an accessible name ending in
//             "opens Instagram" / "ouvre Instagram", images served by the site (200, image/webp),
//             video and carousel markers, the Instagram button after the grid
//   none      no tile at all, the Instagram button still there
import { createHmac } from "node:crypto";
import { existsSync, rmSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";
import { BASE_URL } from "./lib/site.mjs";

const NL = String.fromCharCode(10);
const EXPECT = process.env.IG_EXPECT || "none";
const KEY = process.env.IG_CONNECT_SECRET;
const SECRET = process.env.IG_APP_SECRET;
const DATA = path.resolve(process.env.IG_DATA_DIR || "./.data");
const STANDIN = Number(process.env.IG_STANDIN_PORT || 3199);
const failures = [];
let passed = 0;
const check = (name, ok, detail = "") => {
  if (ok) passed += 1;
  else failures.push(`${name}${detail ? `  ${detail}` : ""}`);
};
const get = (p) => fetch(BASE_URL + p, { redirect: "manual" });
const state = () => {
  const ts = String(Date.now());
  return `${ts}.${createHmac("sha256", SECRET).update(ts).digest("base64url")}`;
};

if (!KEY || !SECRET) {
  console.error("check:ig-site needs IG_CONNECT_SECRET and IG_APP_SECRET (the values the server runs with)");
  process.exit(1);
}

// connect + status
check("connect without key: 404", (await get("/api/ig/connect")).status === 404);
check("connect wrong key: 404", (await get("/api/ig/connect?key=wrong")).status === 404);
const connect = await get(`/api/ig/connect?key=${encodeURIComponent(KEY)}`);
const location = new URL(connect.headers.get("location") || "http://x/");
check("connect right key: 302", connect.status === 302, String(connect.status));
check("connect goes to www.instagram.com/oauth/authorize", location.origin + location.pathname === "https://www.instagram.com/oauth/authorize", location.href.slice(0, 60));
check(
  "connect parameters",
  location.searchParams.get("client_id") === process.env.IG_APP_ID &&
    location.searchParams.get("redirect_uri") === process.env.IG_REDIRECT_URI &&
    location.searchParams.get("response_type") === "code" &&
    location.searchParams.get("scope") === "instagram_business_basic",
);
const signed = location.searchParams.get("state") || "";
const [ts, sig] = signed.split(".");
check("connect state is a fresh signed timestamp", sig === createHmac("sha256", SECRET).update(ts).digest("base64url") && Math.abs(Date.now() - Number(ts)) < 60000);
check("connect sets no cookie", !connect.headers.get("set-cookie"));
check("connect is noindex", (connect.headers.get("x-robots-tag") || "").includes("noindex"));
check("status wrong key: 404", (await get("/api/ig/status?key=wrong")).status === 404);
const statusRes = await get(`/api/ig/status?key=${encodeURIComponent(KEY)}`);
const statusText = await statusRes.text();
const status = JSON.parse(statusText || "{}");
check("status right key: health JSON", statusRes.status === 200 && ["connected", "username", "tokenAgeDays", "expiresInDays", "lastFeedOk", "lastError"].every((k) => k in status), statusText.slice(0, 80));

// callback against a stand-in Instagram
let username = "someone_else";
const standin = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  const reply = (body) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
  };
  if (url.pathname === "/oauth/access_token" && req.method === "POST") return reply({ data: [{ access_token: "SHORT", user_id: "17841", permissions: "instagram_business_basic" }] });
  if (url.pathname === "/access_token") return reply({ access_token: "LONG", token_type: "bearer", expires_in: 5184000 });
  if (url.pathname.endsWith("/me")) return reply({ user_id: "17841", username });
  res.writeHead(404);
  res.end();
});
await new Promise((r) => standin.listen(STANDIN, "127.0.0.1", r));
const tokenFile = path.join(DATA, "token.json");
const hadToken = existsSync(tokenFile);
try {
  check("callback bad state: refused", (await get("/api/ig/callback?code=abc&state=123.forged")).status === 400);
  const other = await get(`/api/ig/callback?code=abc&state=${encodeURIComponent(state())}`);
  check("callback other account: refused", other.status === 403, String(other.status));
  check("callback other account: nothing stored", !existsSync(tokenFile) || hadToken);
  username = "polobrokers";
  const ok = await get(`/api/ig/callback?code=abc&state=${encodeURIComponent(state())}`);
  const page = await ok.text();
  check("callback @polobrokers: connected page", ok.status === 200 && page.includes("Instagram connected.") && page.includes("Instagram est connect"), String(ok.status));
  check("callback @polobrokers: token.json written", existsSync(tokenFile));
  const after = JSON.parse(await (await get(`/api/ig/status?key=${encodeURIComponent(KEY)}`)).text());
  check("status after connect", after.connected === true && after.username === "polobrokers" && after.expiresInDays >= 59 && !JSON.stringify(after).includes("LONG"));
} finally {
  standin.close();
  if (!hadToken) rmSync(tokenFile, { force: true });
}

// media whitelist (raw paths, not normalised by a URL parser)
const raw = (p) =>
  new Promise((resolve) => {
    const u = new URL(BASE_URL);
    http.get({ host: u.hostname, port: u.port, path: p }, (res) => {
      res.resume();
      resolve(res.statusCode);
    });
  });
for (const p of ["/ig-media/..%2Ftoken.json", "/ig-media/%2E%2E%2F%2E%2E%2Fpackage.json", "/ig-media/token.json", "/ig-media/feed.json", "/ig-media/a-640.webp.tmp", "/ig-media/..%5Cfeed.json"]) {
  check(`media refuses ${p}`, (await raw(p)) === 404);
}

// rendering
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  for (const [route, opens] of [["/", "opens Instagram"], ["/fr", "ouvre Instagram"], ["/collection", "opens Instagram"], ["/fr/collection", "ouvre Instagram"]]) {
    await page.goto(BASE_URL + route, { waitUntil: "networkidle" });
    const info = await page.evaluate(() => {
      const tiles = [...document.querySelectorAll('a[href*="instagram.com"] img[src^="/ig-media/"]')].map((img) => img.closest("a"));
      const button = [...document.querySelectorAll("main a.btn")].find((a) => a.textContent.includes("@polobrokers"));
      const grid = tiles[0]?.closest("ul");
      return {
        count: tiles.length,
        newTab: tiles.every((a) => a.target === "_blank" && a.rel.includes("noopener") && a.rel.includes("noreferrer")),
        names: tiles.map((a) => a.textContent.trim() + "|" + a.querySelector("img").alt),
        srcs: tiles.map((a) => a.querySelector("img").currentSrc || a.querySelector("img").src),
        markers: tiles.filter((a) => a.querySelector('[aria-hidden="true"]')).length,
        buttonAfterGrid: Boolean(button && (!grid || grid.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING)),
      };
    });
    if (EXPECT === "grid") {
      check(`${route} grid: 6 tiles`, info.count === 6, String(info.count));
      check(`${route} grid: new tab, noopener noreferrer`, info.newTab);
      check(`${route} grid: names end with "${opens}"`, info.names.every((n) => n.split("|")[0].endsWith(opens) && n.split("|")[1].length > 0));
      check(`${route} grid: video and carousel markers`, info.markers >= 2, String(info.markers));
      for (const src of info.srcs) {
        const res = await fetch(src);
        check(`${route} grid: ${new URL(src).pathname} served by the site`, new URL(src).origin === new URL(BASE_URL).origin && res.status === 200 && res.headers.get("content-type") === "image/webp");
      }
    } else {
      check(`${route} fallback: no tiles`, info.count === 0, String(info.count));
    }
    check(`${route} Instagram button after the grid`, info.buttonAfterGrid);
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`check:ig-site FAILED (${failures.length} of ${passed + failures.length}, mode ${EXPECT})${NL}${failures.join(NL)}`);
  process.exit(1);
}
console.log(`check:ig-site ok · mode ${EXPECT} · ${passed} checks · connect, status, callback (stand-in Instagram), media whitelist, rendering`);
