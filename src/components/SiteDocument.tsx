import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { fontVariables } from "@/lib/fonts";
import { getDictionary, type Locale } from "@/lib/i18n";
import "@/app/globals.css";

// The html document of one language tree. Each tree has its own root layout, so html lang is right
// from the first byte: (en) renders lang="en", (fr)/fr renders lang="fr".
export function SiteDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = getDictionary(locale);
  return (
    <html lang={locale} className={fontVariables}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="label sr-only z-[60] bg-green px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:inline-flex focus:min-h-[44px] focus:items-center"
        >
          {dict.a11y.skipToContent}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
