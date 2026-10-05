// Zac's logo (the sign), prepared by scripts/prepare-logo.mjs into public/brand.
// Heights are CSS px; each has a 1x and a 2x WebP. Keep in sync with HEIGHTS in that script.
export const LOGO_SIZE = { width: 1202, height: 1216 };

export const LOGO_HEIGHTS = {
  /** Header and drawer, below 800px. */
  headerMobile: 64,
  /** Header from 800px. */
  headerDesktop: 80,
  /** Hero card, below 800px. */
  heroMobile: 240,
  /** Hero card from 800px. */
  heroDesktop: 300,
} as const;

export function logoSource(height: number) {
  return {
    src: `/brand/logo-${height}.webp`,
    srcSet: `/brand/logo-${height}.webp 1x, /brand/logo-${height * 2}.webp 2x`,
    width: Math.round((height * LOGO_SIZE.width) / LOGO_SIZE.height),
    height,
  };
}
