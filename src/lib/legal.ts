// Legal notice facts, single source. Unknown facts are null and render nothing at all (no label,
// no placeholder). npm run check:launch fails while any field here is null.
// No imports: scripts/check-launch.mjs reads this file on its own.

export type LegalInfo = {
  /** PENDING FROM ZAC */
  entityName: string | null;
  /** PENDING FROM ZAC */
  entityAddress: string | null;
  /** PENDING FROM ZAC */
  registrationNumber: string | null;
  /** PENDING FROM ZAC */
  publicationDirector: string | null;
  hosting: { en: string; fr: string };
  design: { name: string; url: string };
  updated: { en: string; fr: string };
};

export const LEGAL: LegalInfo = {
  entityName: null,
  entityAddress: null,
  registrationNumber: null,
  publicationDirector: null,
  hosting: { en: "Hostinger, Singapore", fr: "Hostinger, Singapour" },
  design: { name: "Mikaro Studio", url: "https://mikaro.studio" },
  updated: { en: "October 2026", fr: "octobre 2026" },
};
