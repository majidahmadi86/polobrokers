import Script from "next/script";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MOTION_SCRIPT, RevealObserver } from "@/components/RevealObserver";
import { fontVariables } from "@/lib/fonts";
import { getDictionary, shellDict, type Locale } from "@/lib/i18n";
import "@/app/globals.css";

// The html document of one language tree. Each tree has its own root layout, so html lang is right
// from the first byte: (en) renders lang="en", (fr)/fr renders lang="fr".
export function SiteDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = getDictionary(locale);
  return (
    // suppressHydrationWarning: MOTION_SCRIPT adds the "motion" class before React hydrates.
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        {/* App Router root layout is the documented place for beforeInteractive; the rule predates it. */}
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <Script id="motion" strategy="beforeInteractive">
          {MOTION_SCRIPT}
        </Script>
        <a
          href="#main"
          className="label sr-only z-[60] bg-green px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:inline-flex focus:min-h-[44px] focus:items-center"
        >
          {dict.a11y.skipToContent}
        </a>
        <Header locale={locale} dict={shellDict(dict)} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
        <RevealObserver />
      </body>
    </html>
  );
}
