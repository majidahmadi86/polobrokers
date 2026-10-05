import { LOGO_HEIGHTS, logoSource } from "@/lib/brand";

// Zac's logo, as supplied (cut out from its white field, nothing else changed). Pre-sized WebP at
// 1x and 2x, a smaller size below 800px. Plain <picture>: the files are already optimised, so the
// image optimiser has nothing to add.
const SIZES = {
  header: { mobile: LOGO_HEIGHTS.headerMobile, desktop: LOGO_HEIGHTS.headerDesktop },
  hero: { mobile: LOGO_HEIGHTS.heroMobile, desktop: LOGO_HEIGHTS.heroDesktop },
} as const;

export function Logo({ variant, priority = false, className = "" }: { variant: keyof typeof SIZES; priority?: boolean; className?: string }) {
  const mobile = logoSource(SIZES[variant].mobile);
  const desktop = logoSource(SIZES[variant].desktop);
  return (
    <picture className={`block shrink-0 ${className}`}>
      <source media="(min-width: 800px)" srcSet={desktop.srcSet} width={desktop.width} height={desktop.height} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mobile.src}
        srcSet={mobile.srcSet}
        width={mobile.width}
        height={mobile.height}
        alt="Polo Brokers"
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className="block h-auto w-auto max-w-none"
      />
    </picture>
  );
}
