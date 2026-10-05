// Cuts Zac's logo (docs/logo.png: the sign on a solid white field) out to a transparent PNG and
// writes the web sizes. The logo's content is not altered: only the white field around the arch goes.
//   node scripts/prepare-logo.mjs
// 1 The white field is flood-filled from the image border (pixels whose darkest channel is >= 236,
//   which also takes the faint grey fringe just outside the edge).
// 2 The sign's outermost pixels (within 2px of the field) get a partial alpha by un-mixing them from
//   white, so the edge stays anti-aliased with no white halo on any ground.
// 3 Trimmed to the sign. Outputs (committed):
//   public/brand/logo.png              full resolution, transparent
//   public/brand/logo-<h>.webp         heights used on the site, at 1x and 2x (see src/lib/brand.ts)
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const SOURCE = "docs/logo.png";
const OUT = "public/brand";
const FIELD_MIN = 236;
const EDGE_BAND = 2;
const EDGE_REF = 70; // darkest channel of the sign's own rim; below this an edge pixel is fully opaque
// Display heights in CSS px (must match src/lib/brand.ts); each is written at 1x and 2x.
const HEIGHTS = [64, 80, 240, 300];

const { data, info } = await sharp(SOURCE).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const minC = (i) => Math.min(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);

// 1 Flood fill of the field from every border pixel.
const field = new Uint8Array(w * h);
const stack = [];
const push = (x, y) => {
  if (x < 0 || y < 0 || x >= w || y >= h) return;
  const i = y * w + x;
  if (field[i] || minC(i) < FIELD_MIN) return;
  field[i] = 1;
  stack.push(i);
};
for (let x = 0; x < w; x++) {
  push(x, 0);
  push(x, h - 1);
}
for (let y = 0; y < h; y++) {
  push(0, y);
  push(w - 1, y);
}
while (stack.length) {
  const i = stack.pop();
  const x = i % w;
  const y = (i - x) / w;
  push(x + 1, y);
  push(x - 1, y);
  push(x, y + 1);
  push(x, y - 1);
}

// Distance (in px, up to EDGE_BAND) from the field, for the edge band.
const dist = new Uint8Array(w * h).fill(255);
for (let i = 0; i < w * h; i++) if (field[i]) dist[i] = 0;
for (let pass = 1; pass <= EDGE_BAND; pass++) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (dist[i] !== 255) continue;
      const near = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].some(([dx, dy]) => {
        const xx = x + dx;
        const yy = y + dy;
        return xx >= 0 && yy >= 0 && xx < w && yy < h && dist[yy * w + xx] === pass - 1;
      });
      if (near) dist[i] = pass;
    }
  }
}

// 2 RGBA with un-mixed edge pixels.
const rgba = Buffer.alloc(w * h * 4);
let minX = w, minY = h, maxX = 0, maxY = 0;
for (let i = 0; i < w * h; i++) {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
  let a = 1;
  if (field[i]) a = 0;
  else if (dist[i] <= EDGE_BAND) a = Math.min(1, Math.max(0, (255 - minC(i)) / (255 - EDGE_REF)));
  const unmix = (c) => (a > 0 && a < 1 ? Math.round(Math.min(255, Math.max(0, (c - (1 - a) * 255) / a))) : c);
  rgba[i * 4] = unmix(r);
  rgba[i * 4 + 1] = unmix(g);
  rgba[i * 4 + 2] = unmix(b);
  rgba[i * 4 + 3] = Math.round(a * 255);
  if (a > 0) {
    const x = i % w;
    const y = (i - x) / w;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
}

// 3 Trim and write.
mkdirSync(OUT, { recursive: true });
const trimmed = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .png()
  .toBuffer();
const full = await sharp(trimmed).png({ compressionLevel: 9 }).toFile(`${OUT}/logo.png`);
console.log(`${OUT}/logo.png  ${full.width}x${full.height}  (source ${w}x${h}, field removed, trimmed)`);
for (const height of HEIGHTS) {
  for (const density of [1, 2]) {
    const px = height * density;
    if (px > full.height) {
      console.log(`skip ${height}px @${density}x: source is ${full.height}px tall`);
      continue;
    }
    const out = `${OUT}/logo-${px}.webp`;
    const res = await sharp(trimmed).resize({ height: px, kernel: "lanczos3" }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(out);
    console.log(`${out}  ${res.width}x${res.height}`);
  }
}
