// Launch gate: fails while any temporary image is still referenced in src/.
//   npm run check:launch
// Temporary images are named temp-* (crops of the prototype assets, until Zac's originals arrive).
// Not part of npm run verify on purpose: it is expected to fail until launch, then it becomes the
// final gate before going live.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const TEMP = /temp-[a-z0-9-]+[.](jpe?g|png|webp|avif|gif|svg)/gi;
const TEXT = /[.](ts|tsx|js|mjs|css|json|md)$/;

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
    .split("\n")
    .forEach((line, i) => {
      for (const m of line.matchAll(TEMP)) hits.push(`${relative(".", file)}:${i + 1}  ${m[0]}`);
    });
}

if (hits.length) {
  console.error(`check:launch FAILED · ${hits.length} temporary image reference(s) in src/\n${hits.join("\n")}`);
  process.exit(1);
}
console.log("check:launch ok · no temporary images referenced in src/");
