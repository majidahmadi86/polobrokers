import { en } from "./en";
import { fr } from "./fr";
import type { Dictionary, PageKey } from "./types";

export type { Dictionary, PageKey };

/**
 * The strings the client components of the shell need (header, drawer, language switch). Passed
 * instead of the whole dictionary, so every page does not carry all copy in its inline payload.
 */
export type ShellDict = Pick<Dictionary, "pages" | "buttons" | "menu" | "language" | "a11y">;

export function shellDict(dict: Dictionary): ShellDict {
  const { pages, buttons, menu, language, a11y } = dict;
  return { pages, buttons, menu, language, a11y };
}

export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

// Same slugs in both languages: EN at the root, FR under /fr.
export const PAGE_SLUGS: Record<PageKey, string> = {
  home: "",
  about: "about",
  collection: "collection",
  sell: "sell",
  contact: "contact",
  legal: "legal",
  privacy: "privacy",
};

export const PAGE_KEYS = Object.keys(PAGE_SLUGS) as PageKey[];

export function localePath(locale: Locale, page: PageKey): string {
  const slug = PAGE_SLUGS[page];
  if (locale === DEFAULT_LOCALE) return slug ? `/${slug}` : "/";
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
}

/** The same page in the other language: /about <-> /fr/about, / <-> /fr. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const bare = localeFromPath(pathname) === "fr" ? pathname.slice(3) || "/" : pathname;
  if (target === DEFAULT_LOCALE) return bare;
  return bare === "/" ? `/${target}` : `/${target}${bare}`;
}
