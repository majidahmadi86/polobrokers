// Generates the favicon, icons and the per-language OG images from the PB monogram.
//   npm run assets:brand
// Outputs (committed, served as static metadata files):
//   src/app/favicon.ico (16 + 32 + 48), src/app/icon.png (64), src/app/apple-icon.png (180),
//   public/og/en.png and public/og/fr.png (1200 x 630), referenced by src/lib/seo.ts. Explicit files
//   rather than opengraph-image.png in the route folders: a page that sets its own openGraph (url,
//   title) would drop the inherited folder image.
// Drawn by Chromium with the local Playfair Display .ttf (src/fonts), mirroring components/Monogram.tsx.
// Why not next/og: in Next 14 its node build resolves its own files with path.join on a file URL,
// which throws on Windows, so the local build fails. Static files also spare the VPS any rendering.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const GREEN = "#0b2e24";
const IVORY = "#f7f1e4";
const font = readFileSync(join(root, "src/fonts/playfair-display-latin-ext-500.ttf")).toString("base64");

const page = (w, h, body) => `<!doctype html><html><head><style>
@font-face { font-family: PD; src: url(data:font/ttf;base64,${font}) format("truetype"); font-weight: 500; }
html, body { margin: 0; width: ${w}px; height: ${h}px; overflow: hidden; }
body { background: ${GREEN}; color: ${IVORY}; font-family: PD, serif; font-weight: 500; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.pb { line-height: .75; letter-spacing: -.16em; padding-right: .16em; }
</style></head><body>${body}</body></html>`;

// Icons: the hero construction (P and B touching), large on the green square.
const icon = (s, radius = 0) =>
  page(s, s, `<div class="pb" style="font-size:${Math.round(s * 0.62)}px;margin-top:${Math.round(s * 0.02)}px">PB</div>`).replace(
    "overflow: hidden;",
    `overflow: hidden; ${radius ? `border-radius:${radius}px;` : ""}`,
  );

// OG: ivory monogram box as in the header, then the letterspaced wordmark.
const og = page(
  1200,
  630,
  `<div style="display:grid;place-items:center;width:200px;height:200px;border:2px solid ${IVORY};font-size:99px">PB</div>
   <div style="margin-top:56px;font-size:58px;letter-spacing:.16em;padding-left:.16em">POLO BROKERS</div>`,
);

function ico(pngs) {
  // ICO container with PNG payloads (supported by every current browser).
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

const browser = await chromium.launch();
try {
  const shot = async (html, w, h, transparent = false) => {
    const tab = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await tab.setContent(html);
    await tab.evaluate(() => document.fonts.ready);
    const data = await tab.screenshot({ omitBackground: transparent });
    await tab.close();
    return data;
  };
  const out = (rel, data) => {
    writeFileSync(join(root, rel), data);
    console.log(`${rel}  ${data.length} bytes`);
  };

  out("src/app/icon.png", await shot(icon(64, 8), 64, 64, true));
  out("src/app/apple-icon.png", await shot(icon(180), 180, 180));
  const sizes = [16, 32, 48];
  const pngs = [];
  for (const s of sizes) pngs.push({ size: s, data: await shot(icon(s, Math.max(2, Math.round(s / 8))), s, s, true) });
  out("src/app/favicon.ico", ico(pngs));

  const ogPng = await shot(og, 1200, 630);
  for (const locale of ["en", "fr"]) out(`public/og/${locale}.png`, ogPng);
} finally {
  await browser.close();
}
