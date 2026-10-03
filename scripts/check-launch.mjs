// Launch gate. Fails while anything provisional is left:
//   temp      a temporary image (temp-*, crops of the prototype assets) referenced in src/
//   legal     a field of src/lib/legal.ts still null (pending from Zac)
//   pending   "PENDING CONFIRMATION" still in src/lib/site.ts (the WhatsApp number)
//   npm run check:launch
// Not part of npm run verify on purpose: it is expected to fail until launch, then it becomes the
// final gate before going live.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
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

// legal.ts has no imports, so it can be transpiled and loaded on its own.
const legalSource = ts.transpileModule(readFileSync("src/lib/legal.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const { LEGAL } = await import(`data:text/javascript;base64,${Buffer.from(legalSource).toString("base64")}`);
for (const [key, value] of Object.entries(LEGAL)) {
  if (value === null) hits.push(`legal    src/lib/legal.ts  ${key} is null (pending from Zac)`);
}

readFileSync("src/lib/site.ts", "utf8")
  .split(NL)
  .forEach((line, i) => {
    if (line.includes(PENDING)) hits.push(`pending  src/lib/site.ts:${i + 1}  ${line.trim().slice(0, 70)}`);
  });

if (hits.length) {
  console.error(`check:launch FAILED · ${hits.length} item(s) to resolve before launch${NL}${hits.join(NL)}`);
  process.exit(1);
}
console.log("check:launch ok · no temporary images, legal facts complete, nothing pending");
