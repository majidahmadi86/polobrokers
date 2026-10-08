// The permanent gate. Runs everything against a production build, never the dev server.
//   npm run verify
// First: lint, i18n parity, the Instagram unit tests. Then the site is built and served three times:
//   fallback  no Instagram token: the site as it is without a feed       (PB_INDEXABLE=1)
//   mock      IG_MOCK=1: the feed rendered from the fixtures through the real image pipeline (PB_INDEXABLE=1)
//   preview   PB_INDEXABLE unset, as on the VPS before launch: only the indexing check (Disallow: /, noindex)
// Each pass: a clean next build (.next removed, so no cache carries over between passes), copy check
// (sources + built HTML), next start on VERIFY_PORT (default 3112), then the link crawl, the privacy
// gate, the responsive gate and the Instagram site test (routes, stand-in Instagram callback, media
// whitelist, rendering); the sell form test and the WhatsApp entry points (iPhone WebKit, Pixel Chromium) run in the fallback pass. Each pass has its own fresh
// data folder. Stops at the first failing gate and prints a summary.
import { spawn, spawnSync } from "node:child_process";
import { rmSync } from "node:fs";

const PORT = process.env.VERIFY_PORT || "3112";
const BASE_URL = `http://localhost:${PORT}`;
const NEXT = "node_modules/next/dist/bin/next";
const NL = String.fromCharCode(10);
const results = [];

// Instagram settings for the gates only: fake app values, Instagram stood in for on localhost.
const IG_TEST = {
  IG_APP_ID: "verify-app",
  IG_APP_SECRET: "verify-app-secret",
  IG_REDIRECT_URI: `${BASE_URL}/api/ig/callback`,
  IG_CONNECT_SECRET: "verify-connect-key",
  IG_STANDIN_PORT: "3199",
  IG_GRAPH_BASE: "http://127.0.0.1:3199",
  IG_OAUTH_BASE: "http://127.0.0.1:3199",
};
const PASSES = [
  { mode: "fallback", env: { PB_INDEXABLE: "1", EXPECT_INDEXABLE: "1", IG_MOCK: "", IG_DATA_DIR: ".data/verify-fallback", IG_EXPECT: "none" }, forms: true },
  { mode: "mock", env: { PB_INDEXABLE: "1", EXPECT_INDEXABLE: "1", IG_MOCK: "1", IG_DATA_DIR: ".data/verify-mock", IG_EXPECT: "grid" }, forms: false },
  { mode: "preview", env: { PB_INDEXABLE: "", EXPECT_INDEXABLE: "0", IG_MOCK: "", IG_DATA_DIR: ".data/verify-preview" }, only: ["check:indexing"] },
];

function run(name, args, env = {}) {
  const started = Date.now();
  const res = spawnSync(process.execPath, args, { stdio: "inherit", env: { ...process.env, ...env } });
  const ok = res.status === 0;
  results.push(`${ok ? "pass" : "FAIL"}  ${name.padEnd(28)} ${((Date.now() - started) / 1000).toFixed(1)}s`);
  return ok;
}

function summary(code) {
  console.log(`${NL}verify summary${NL}${results.map((r) => `  ${r}`).join(NL)}`);
  process.exit(code);
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(BASE_URL + "/");
      if (res.ok) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

function stop(server) {
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  else process.kill(-server.pid, "SIGTERM");
}

for (const [name, args] of [
  ["lint", [NEXT, "lint"]],
  ["check:i18n", ["scripts/check-i18n.mjs"]],
  ["check:ig", ["scripts/check-ig.mjs"]],
]) {
  if (!run(name, args)) summary(1);
}

for (const pass of PASSES) {
  const env = { ...IG_TEST, ...pass.env, BASE_URL };
  rmSync(".next", { recursive: true, force: true });
  rmSync(pass.env.IG_DATA_DIR, { recursive: true, force: true });
  if (!run(`build (${pass.mode})`, [NEXT, "build"], env)) summary(1);
  if (!pass.only && !run(`check:copy (${pass.mode})`, ["scripts/check-copy.mjs"], env)) summary(1);

  const server = spawn(process.execPath, [NEXT, "start", "-p", PORT], {
    stdio: "ignore",
    detached: process.platform !== "win32",
    env: { ...process.env, ...env },
  });
  let failed = false;
  try {
    if (!(await waitForServer())) {
      results.push(`FAIL  next start (${pass.mode})  no answer on ${BASE_URL}`);
      failed = true;
    } else {
      const gates = [
        ["check:indexing", "scripts/check-indexing.mjs"],
        ["check:links", "scripts/check-links.mjs"],
        ...(pass.forms ? [["check:forms", "scripts/check-forms.mjs"], ["check:whatsapp", "scripts/check-whatsapp.mjs"]] : []),
        ["check:privacy", "scripts/check-privacy.mjs"],
        ["check:responsive", "scripts/check-responsive.mjs"],
        // Last: its callback test briefly connects a stand-in account (removed again afterwards).
        ["check:ig-site", "scripts/check-ig-site.mjs"],
      ];
      for (const [name, script] of gates.filter(([name]) => !pass.only || pass.only.includes(name))) {
        if (!run(`${name} (${pass.mode})`, [script], env)) {
          failed = true;
          break;
        }
      }
    }
  } finally {
    stop(server);
  }
  if (failed) summary(1);
}
summary(0);
