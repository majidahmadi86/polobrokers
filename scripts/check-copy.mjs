// Copy hygiene across src/, scripts/, the root config and the built HTML.
//   npm run check:copy        (after next build; without a build only the sources are checked, with a warning)
// Fails on: the em dash (U+2014), any emoji, and the banned phrase below (case-insensitive).
// Extended_Pictographic also covers the copyright, registered and trade mark signs; they are text,
// not emoji, and the footer needs the copyright sign, so those three are allowed.
// Every banned character is built from its code point so this file never contains what it bans.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const cp = (...codes) => String.fromCodePoint(...codes);
const EM_DASH = new RegExp(cp(0x2014));
const EMOJI = new RegExp(String.raw`(?![${cp(0xa9, 0xae, 0x2122)}])\p{Extended_Pictographic}|${cp(0xfe0f)}`, "u");
const PHRASE = new RegExp(["built", "in-house"].join(" +"), "i");
const TEXT = /\.(ts|tsx|js|mjs|cjs|css|json|md|txt|html|xml|py)$/i;
const ROOT_FILES = [".npmrc", ".gitignore", ".eslintrc.json", "package.json", "tailwind.config.ts", "next.config.mjs", "postcss.config.mjs", "tsconfig.json"];

function walk(dir, pattern, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, pattern, out);
    else if (pattern.test(name)) out.push(full);
  }
  return out;
}

const sourceFiles = [...walk("src", TEXT), ...walk("scripts", TEXT), ...ROOT_FILES.filter((f) => existsSync(f))];
// Built pages only (.html and their RSC payloads); .body files can be binary images.
const builtFiles = walk(join(".next", "server", "app"), /\.(html|rsc)$/);
if (!builtFiles.length) console.warn("check:copy warning · no build found in .next/server/app, only sources checked");

const failures = [];
for (const file of [...sourceFiles, ...builtFiles]) {
  const text = readFileSync(file, "utf8");
  text.split("\n").forEach((line, i) => {
    const where = `${relative(".", file)}:${i + 1}`;
    const excerpt = (re) => {
      const at = line.search(re);
      return line.slice(Math.max(0, at - 30), at + 40).trim();
    };
    if (EM_DASH.test(line)) failures.push(`em dash  ${where}  ${excerpt(EM_DASH)}`);
    if (EMOJI.test(line)) failures.push(`emoji    ${where}  ${excerpt(EMOJI)}`);
    if (PHRASE.test(line)) failures.push(`phrase   ${where}  ${excerpt(PHRASE)}`);
  });
}

if (failures.length) {
  console.error(`check:copy FAILED (${failures.length})\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(`check:copy ok · ${sourceFiles.length} source files, ${builtFiles.length} built files · no em dash, no emoji, no banned phrase`);
