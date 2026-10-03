// Instagram feed unit tests. No server, no network: the engine is driven directly with a fake fetch.
//   npm run check:ig
// The IG modules (TypeScript, server-only) are transpiled into .data/ig-test as plain ES modules.
//   sanitizer   emoji stripped, em and en dash to a comma, 120 cut on a word boundary, empty to null
//   refresh     decision: under 24h no, 6 days no, 8 days yes
//   state       HMAC valid, expired, tampered, wrong secret
//   engine      live path with a fake API: 6 posts, WebP files written, stale files dropped, no refresh
//               at 2 days; refresh at 8 days rewrites token.json; failed refresh near expiry warns loudly;
//               API failure without a cache returns null (no throw); API failure with feed.json serves it
//               (stale); a local file source outside mock mode is refused
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const NL = String.fromCharCode(10);
const cp = (...c) => String.fromCodePoint(...c);
const OUT = path.resolve(".data/ig-test");
const failures = [];
let passed = 0;
const check = (name, ok, detail = "") => {
  if (ok) passed += 1;
  else failures.push(`${name}${detail ? `  ${detail}` : ""}`);
};

// Transpile the modules under test, with relative imports pointing at the .mjs copies.
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const name of ["sanitize", "state", "token", "engine"]) {
  const source = readFileSync(`src/lib/ig/${name}.ts`, "utf8").replace(`import "server-only";`, "");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  writeFileSync(path.join(OUT, `${name}.mjs`), outputText.replace(/from "[.][/]([a-z]+)"/g, 'from "./$1.mjs"'));
}
const load = (name) => import(pathToFileURL(path.join(OUT, `${name}.mjs`)).href);
const { sanitizeCaption } = await load("sanitize");
const { createState, verifyState, STATE_TTL_MS } = await load("state");
const { shouldRefresh } = await load("token");
const { buildFeed } = await load("engine");

// Sanitizer.
const EMOJI = new RegExp(String.raw`\p{Extended_Pictographic}`, "u");
const s1 = sanitizeCaption(`New in ${cp(0x2728)} navy blazer ${cp(0x2014)} gold buttons ${cp(0x1f44c, 0x1f3fd)} ${cp(0x2764, 0xfe0f)}`);
check("sanitizer strips emoji", s1 !== null && !EMOJI.test(s1) && !s1.includes(cp(0xfe0f)), JSON.stringify(s1));
check("sanitizer em dash becomes a comma", s1 === "New in navy blazer, gold buttons", JSON.stringify(s1));
check("sanitizer en dash becomes a comma", sanitizeCaption(`Size M ${cp(0x2013)} very good`) === "Size M, very good");
const long = "word ".repeat(40).trim();
const s2 = sanitizeCaption(long);
check("sanitizer cuts at 120 on a word boundary", s2.length <= 120 && s2.endsWith("word") && long.startsWith(s2), `${s2.length}`);
check("sanitizer empty caption is null", sanitizeCaption("") === null && sanitizeCaption(null) === null);
check("sanitizer emoji-only caption is null", sanitizeCaption(`${cp(0x1f525)} ${cp(0x1f525)}`) === null);
check("sanitizer collapses whitespace", sanitizeCaption("  a   b  ") === "a b");

// Refresh decision.
const now = Date.parse("2026-10-06T12:00:00Z");
const ago = (ms) => ({ obtainedAt: new Date(now - ms).toISOString() });
const H = 3600 * 1000;
check("refresh: 1 hour old, no", shouldRefresh(ago(H), now) === false);
check("refresh: 23 hours old, no", shouldRefresh(ago(23 * H), now) === false);
check("refresh: 6 days old, no", shouldRefresh(ago(6 * 24 * H), now) === false);
check("refresh: 8 days old, yes", shouldRefresh(ago(8 * 24 * H), now) === true);

// State HMAC.
const secret = "unit-test-secret";
const state = createState(secret, now);
check("state valid", verifyState(state, secret, now + 60 * 1000));
check("state expired after 15 minutes", !verifyState(state, secret, now + STATE_TTL_MS + 1000));
const [ts1, sig] = state.split(".");
check("state tampered timestamp", !verifyState(`${Number(ts1) + 1}.${sig}`, secret, now));
check("state tampered signature", !verifyState(`${ts1}.${sig.slice(0, -2)}xx`, secret, now));
check("state wrong secret", !verifyState(state, "other-secret", now));
check("state garbage", !verifyState("abc", secret, now) && !verifyState(null, secret, now));

// Engine with a fake Instagram.
const JPEG = readFileSync("public/images/temp-hero.jpg");
function fakeApi({ mediaStatus = 200, refreshStatus = 200, calls }) {
  return async (url) => {
    const u = new URL(url);
    calls.push(u.pathname);
    const reply = (status, body) => new Response(typeof body === "string" ? body : JSON.stringify(body), { status });
    if (u.pathname === "/refresh_access_token") return refreshStatus === 200 ? reply(200, { access_token: "REFRESHED", token_type: "bearer", expires_in: 5184000 }) : reply(refreshStatus, { error: "x" });
    if (u.pathname.endsWith("/media")) {
      if (mediaStatus !== 200) return reply(mediaStatus, { error: { message: "boom" } });
      const data = [1, 2, 3, 4, 5, 6].map((i) => ({
        id: `9000${i}`,
        caption: i === 2 ? "" : `Post ${i}`,
        media_type: i === 3 ? "VIDEO" : i === 4 ? "CAROUSEL_ALBUM" : "IMAGE",
        media_url: `https://cdn.example/${i}.jpg`,
        thumbnail_url: i === 3 ? `https://cdn.example/${i}-thumb.jpg` : undefined,
        permalink: `https://www.instagram.com/p/${i}/`,
      }));
      return reply(200, { data });
    }
    if (u.hostname === "cdn.example") return new Response(JPEG, { status: 200 });
    return reply(404, {});
  };
}
const logs = [];
const deps = (dataDir, fetchFn, extra = {}) => ({
  dataDir,
  mock: false,
  fixturesDir: path.resolve("tests/fixtures/ig"),
  appSecret: "s",
  graphBase: "https://graph.example",
  apiVersion: "v25.0",
  fetch: fetchFn,
  now: () => now,
  log: (m) => logs.push(m),
  ...extra,
});
const tokenAt = (dir, ageDays, expiresDays = 50) => {
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "token.json"),
    JSON.stringify({
      token: "LONG",
      userId: "17841",
      username: "polobrokers",
      obtainedAt: new Date(now - ageDays * 24 * H).toISOString(),
      expiresAt: new Date(now + expiresDays * 24 * H).toISOString(),
    }),
  );
};

const live = path.join(OUT, "live");
tokenAt(live, 2);
mkdirSync(path.join(live, "media"), { recursive: true });
writeFileSync(path.join(live, "media", "old1-640.webp"), "stale");
let calls = [];
const feed = await buildFeed(deps(live, fakeApi({ calls })));
check("engine live: 6 posts", feed?.posts.length === 6, JSON.stringify(feed)?.slice(0, 80));
const written = [1, 2, 3, 4, 5, 6].flatMap((i) => [640, 1080].map((w) => path.join(live, "media", `9000${i}-${w}.webp`)));
check("engine live: WebP 640 and 1080 written for all 6", written.every((f) => existsSync(f)));
check("engine live: stale image dropped", !existsSync(path.join(live, "media", "old1-640.webp")));
check("engine live: video uses its thumbnail", calls.includes("/3-thumb.jpg") && !calls.includes("/3.jpg"));
check("engine live: empty caption gives null alt", feed?.posts[1].alt === null);
check("engine live: no refresh at 2 days", !calls.includes("/refresh_access_token"));
check("engine live: feed.json written", existsSync(path.join(live, "feed.json")));

const aged = path.join(OUT, "aged");
tokenAt(aged, 8);
calls = [];
await buildFeed(deps(aged, fakeApi({ calls })));
const refreshed = JSON.parse(readFileSync(path.join(aged, "token.json"), "utf8"));
check("engine refresh at 8 days", calls.includes("/refresh_access_token") && refreshed.token === "REFRESHED" && refreshed.obtainedAt === new Date(now).toISOString());

const expiring = path.join(OUT, "expiring");
tokenAt(expiring, 52, 5);
logs.length = 0;
calls = [];
const stillFeed = await buildFeed(deps(expiring, fakeApi({ calls, refreshStatus: 500 })));
const status = JSON.parse(readFileSync(path.join(expiring, "status.json"), "utf8"));
check("engine failed refresh near expiry warns loudly", logs.some((l) => l.includes("WARNING") && l.includes("5 DAYS")) && status.warning?.includes("5 DAYS"));
check("engine failed refresh still serves the feed", stillFeed?.posts.length === 6);

const failing = path.join(OUT, "failing");
tokenAt(failing, 2);
let result;
let threw = false;
try {
  result = await buildFeed(deps(failing, fakeApi({ calls: [], mediaStatus: 500 })));
} catch {
  threw = true;
}
check("engine API failure without cache: null, no throw", !threw && result === null);
check("engine API failure recorded in status", JSON.parse(readFileSync(path.join(failing, "status.json"), "utf8")).lastError?.includes("HTTP 500"));

const stale = await buildFeed(deps(live, fakeApi({ calls: [], mediaStatus: 500 })));
check("engine API failure serves the last good feed.json", stale?.stale === true && stale.posts.length === 6);

const noToken = await buildFeed(deps(path.join(OUT, "empty"), fakeApi({ calls: [] })));
check("engine without token: null", noToken === null);

const local = path.join(OUT, "local");
tokenAt(local, 2);
const localFetch = async (url) =>
  new URL(url).pathname.endsWith("/media")
    ? new Response(JSON.stringify({ data: [{ id: "1", media_type: "IMAGE", media_url: "file:package.json", permalink: "https://www.instagram.com/p/1/" }] }))
    : new Response("{}", { status: 404 });
check("engine refuses file: sources outside mock mode", (await buildFeed(deps(local, localFetch))) === null);

rmSync(OUT, { recursive: true, force: true });
if (failures.length) {
  console.error(`check:ig FAILED (${failures.length} of ${passed + failures.length})${NL}${failures.join(NL)}`);
  process.exit(1);
}
console.log(`check:ig ok · ${passed} checks · sanitizer, refresh decision, state HMAC, engine (live, refresh, expiry warning, failure, stale, no token)`);
