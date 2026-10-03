// Dictionary parity: EN and FR have exactly the same keys, and no string is empty.
//   npm run check:i18n
// The TypeScript type already fails the build on a missing key; this also catches extra keys,
// empty strings and whitespace-only strings, and runs without a build.
import { readFileSync } from "node:fs";
import ts from "typescript";

async function load(file, name) {
  const source = readFileSync(file, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  });
  const mod = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  return mod[name];
}

function flatten(obj, prefix = "", out = new Map()) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") flatten(value, path, out);
    else out.set(path, value);
  }
  return out;
}

const en = flatten(await load("src/lib/i18n/en.ts", "en"));
const fr = flatten(await load("src/lib/i18n/fr.ts", "fr"));
const failures = [];
for (const key of en.keys()) if (!fr.has(key)) failures.push(`missing in fr  ${key}`);
for (const key of fr.keys()) if (!en.has(key)) failures.push(`missing in en  ${key}`);
for (const [lang, map] of [["en", en], ["fr", fr]]) {
  for (const [key, value] of map) {
    if (typeof value !== "string") failures.push(`not a string   ${lang} ${key}`);
    else if (!value.trim()) failures.push(`empty          ${lang} ${key}`);
  }
}

if (failures.length) {
  console.error(`check:i18n FAILED (${failures.length})\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(`check:i18n ok · ${en.size} keys in en and fr, none empty`);
