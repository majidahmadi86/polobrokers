import { WHATSAPP_NUMBER } from "./site";

// Legal notice facts, single source, as supplied by Zac (Swiss company).
// Required for launch (npm run check:launch fails while null): entityName, entityAddress.
// Optional: registrationNumber; while null it renders nothing at all (no label, no placeholder).
// Only relative imports of files without imports of their own: scripts/check-launch.mjs loads it.

export type LegalInfo = {
  entityName: string | null;
  entityAddress: { en: string; fr: string } | null;
  /** Optional. */
  registrationNumber: string | null;
  /** Digits, international format (the WhatsApp number). */
  phone: string;
  hosting: { en: string; fr: string };
  design: { name: string; url: string };
  updated: { en: string; fr: string };
};

export const LEGAL_REQUIRED = ["entityName", "entityAddress"] as const;

export const LEGAL: LegalInfo = {
  entityName: "Balzac Outsiders Trading SARL",
  entityAddress: { en: "1870 Monthey, Switzerland", fr: "1870 Monthey, Suisse" },
  registrationNumber: null,
  phone: WHATSAPP_NUMBER,
  hosting: { en: "Hostinger, Singapore", fr: "Hostinger, Singapour" },
  design: { name: "Mikaro Studio", url: "https://mikaro.studio" },
  updated: { en: "October 2026", fr: "octobre 2026" },
};
