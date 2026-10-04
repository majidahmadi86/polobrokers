// Launch gate. Fails while anything provisional is left:
//   temp      a temporary image (temp-*, crops of the prototype assets) referenced in src/
//   legal     a required field of src/lib/legal.ts (LEGAL_REQUIRED) still null
//   pending   "PENDING CONFIRMATION" still in src/lib/site.ts (the WhatsApp number)
//   npm run check:launch
// Not part of npm run verify on purpose: it is expected to fail until launch, then it becomes the
// final gate before going live.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const TEMP = /temp-[a-z0-9-]+[.](jpe?g|png|webp|avif|gif|svg)/gi;
const TEXT = /[.](ts|tsx|js|mjs|css|json|md)$/;
const NL = String.fromCharCode(10);
// Assembled so this file does not match its own search.
const PENDING = ["PENDING", "CONFIRMATION"].join(" ");

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (TEXT.test(name)) out.push(full);
  }
  return out;
}

const hits = [];
for (const file of walk("src")) {
  readFileSync(file, "utf8")
    .split(NL)
    .forEach((line, i) => {
      for (const m of line.matchAll(TEMP)) hits.push(`temp     ${relative(".", file)}:${i + 1}  ${m[0]}`);
    });
}

// legal.ts imports site.ts: both are transpiled into a scratch folder and loaded from there.
const scratch = resolve(".data/launch-check");
mkdirSync(scratch, { recursive: true });
for (const name of ["site", "legal"]) {
  const { outputText } = ts.transpileModule(readFileSync(`src/lib/${name}.ts`, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  });
  writeFileSync(join(scratch, `${name}.mjs`), outputText.replace(/from "[.][/]([a-z]+)"/g, (_, m) => `from "./${m}.mjs"`));
}
const { LEGAL, LEGAL_REQUIRED } = await import(pathToFileURL(join(scratch, "legal.mjs")).href);
rmSync(scratch, { recursive: true, force: true });
for (const key of LEGAL_REQUIRED) {
  if (LEGAL[key] === null) hits.push(`legal    src/lib/legal.ts  ${key} is null (required, pending from Zac)`);
}

readFileSync("src/lib/site.ts", "utf8")
  .split(NL)
  .forEach((line, i) => {
    if (line.includes(PENDING)) hits.push(`pending  src/lib/site.ts:${i + 1}  ${line.trim().slice(0, 70)}`);
  });

// A reminder, not a failure: the indexing switch lives in the server environment, not in the code.
console.log("Before launch: add PB_INDEXABLE=1 to the VPS .env.local, then run deploy.sh");

if (hits.length) {
  console.error(`check:launch FAILED · ${hits.length} item(s) to resolve before launch${NL}${hits.join(NL)}`);
  process.exit(1);
}
console.log("check:launch ok · no temporary images, legal facts complete, nothing pending");
