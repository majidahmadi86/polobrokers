import type { MetadataRoute } from "next";
import { LOCALES, PAGE_KEYS, localePath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

// Every page in both languages (14 URLs), each with its language alternates.
export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    PAGE_KEYS.map((page) => ({
      url: `${SITE_URL}${localePath(locale, page)}`,
      changeFrequency: "monthly" as const,
      priority: page === "home" ? 1 : 0.7,
      alternates: {
        languages: {
          en: `${SITE_URL}${localePath("en", page)}`,
          fr: `${SITE_URL}${localePath("fr", page)}`,
          "x-default": `${SITE_URL}${localePath("en", page)}`,
        },
      },
    })),
  );
}
