"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Brand } from "@/components/Brand";
import { ExternalLink } from "@/components/ExternalLink";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { MobileMenu } from "@/components/MobileMenu";
import { localePath, type Dictionary, type Locale, type PageKey } from "@/lib/i18n";
import { INSTAGRAM_URL } from "@/lib/site";

const HEADER_NAV: PageKey[] = ["about", "collection", "sell"];

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

  return (
    <header className="relative z-20 border-b border-rule bg-warm/[.96]">
      <div className="flex items-center justify-between gap-4 px-[5vw] py-[15px] min-[800px]:py-5">
        <Brand locale={locale} dict={dict} />

        <div className="hidden items-center gap-6 nav:flex">
          <nav aria-label={dict.a11y.mainNav}>
            <ul className="flex items-center gap-6">
              {HEADER_NAV.map((page) => {
                const href = localePath(locale, page);
                return (
                  <li key={page}>
                    <Link
                      href={href}
                      aria-current={pathname === href ? "page" : undefined}
                      className="label inline-flex min-h-[44px] min-w-[44px] items-center justify-center no-underline decoration-gold decoration-1 underline-offset-[6px] hover:underline aria-[current=page]:underline"
                    >
                      {dict.pages[page]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ExternalLink href={INSTAGRAM_URL} className="label inline-flex min-h-[44px] items-center bg-green px-4 text-white no-underline">
            {dict.buttons.instagram}
          </ExternalLink>
          <LanguageSwitch locale={locale} dict={dict} />
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-label={dict.menu.open}
          aria-expanded={open}
          aria-controls="site-drawer"
          onClick={() => setOpen(true)}
          className="-mr-[10px] inline-flex h-[44px] w-[44px] shrink-0 flex-col items-center justify-center gap-[6px] text-green nav:hidden"
        >
          <span aria-hidden="true" className="block h-px w-6 bg-current" />
          <span aria-hidden="true" className="block h-px w-6 bg-current" />
          <span aria-hidden="true" className="block h-px w-6 bg-current" />
        </button>
      </div>

      <MobileMenu locale={locale} dict={dict} open={open} onClose={close} returnFocusRef={toggleRef} />
    </header>
  );
}
