// The permanent gate. Runs everything against a production build, never the dev server.
//   npm run verify
// lint, i18n parity, next build, copy check (sources + built HTML), then next start on VERIFY_PORT
// (default 3112) for the link crawl, the sell form test and the responsive gate, then stops the server.
// Stops at the first failing gate and prints a summary.
import { spawn, spawnSync } from "node:child_process";

const PORT = process.env.VERIFY_PORT || "3112";
const BASE_URL = `http://localhost:${PORT}`;
const NEXT = "node_modules/next/dist/bin/next";
const results = [];

function run(name, args, env = {}) {
  const started = Date.now();
  const res = spawnSync(process.execPath, args, { stdio: "inherit", env: { ...process.env, ...env } });
  const ok = res.status === 0;
  results.push(`${ok ? "pass" : "FAIL"}  ${name.padEnd(17)} ${((Date.now() - started) / 1000).toFixed(1)}s`);
  return ok;
}

function summary(code) {
  console.log(`\nverify summary\n${results.map((r) => `  ${r}`).join("\n")}`);
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

const before = [
  ["lint", [NEXT, "lint"]],
  ["check:i18n", ["scripts/check-i18n.mjs"]],
  ["build", [NEXT, "build"]],
  ["check:copy", ["scripts/check-copy.mjs"]],
];
for (const [name, args] of before) if (!run(name, args)) summary(1);

const server = spawn(process.execPath, [NEXT, "start", "-p", PORT], { stdio: "ignore", detached: process.platform !== "win32" });
let code = 0;
try {
  if (!(await waitForServer())) {
    results.push(`FAIL  next start        no answer on ${BASE_URL}`);
    code = 1;
  } else {
    for (const [name, script] of [
      ["check:links", "scripts/check-links.mjs"],
      ["check:forms", "scripts/check-forms.mjs"],
      ["check:responsive", "scripts/check-responsive.mjs"],
    ]) {
      if (!run(name, [script], { BASE_URL })) {
        code = 1;
        break;
      }
    }
  }
} finally {
  stop(server);
}
summary(code);
