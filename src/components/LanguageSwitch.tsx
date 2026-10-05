"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, switchLocalePath, type ShellDict, type Locale } from "@/lib/i18n";

// EN / FR in the small caps label system. Keeps the current path: /about <-> /fr/about.
export function LanguageSwitch({ locale, dict, className = "" }: { locale: Locale; dict: ShellDict; className?: string }) {
  const pathname = usePathname() || "/";
  return (
    <ul aria-label={dict.language.label} className={`label flex items-center ${className}`}>
      {LOCALES.map((code, index) => (
        <li key={code} className="flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="px-0.5">
              /
            </span>
          )}
          <Link
            href={switchLocalePath(pathname, code)}
            hrefLang={code}
            lang={code}
            aria-label={dict.language[code]}
            aria-current={code === locale ? "true" : undefined}
            className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center no-underline ${
              code === locale ? "underline decoration-gold decoration-1 underline-offset-[6px]" : ""
            }`}
          >
            {code.toUpperCase()}
          </Link>
        </li>
      ))}
    </ul>
  );
}
