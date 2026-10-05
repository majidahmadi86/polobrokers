"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type RefObject } from "react";
import { ExternalLink } from "@/components/ExternalLink";
import { Brand } from "@/components/Brand";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { localePath, type Dictionary, type Locale, type PageKey } from "@/lib/i18n";
import { INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/site";

const DRAWER_NAV: PageKey[] = ["home", "about", "collection", "sell", "contact"];
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type MobileMenuProps = {
  locale: Locale;
  dict: Dictionary;
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement>;
};

// Full-screen ivory drawer below 1024px. Modal dialog: focus is trapped inside, Esc closes, the page
// behind does not scroll, and it closes itself on any route change or when the window grows past 1024px.
export function MobileMenu({ locale, dict, open, onClose, returnFocusRef }: MobileMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Close on route change.
  useEffect(() => {
    onClose();
    // onClose is a fresh closure every render; only the path matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) returnFocusRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;

    // Scroll lock without layout shift: the scrollbar's width is given back as padding.
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panelRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && onClose();

    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
    };
  }, [open, onClose, returnFocusRef]);

  return (
    <div
      id="site-drawer"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={dict.menu.open}
      hidden={!open}
      className="fixed inset-0 z-50 overflow-y-auto bg-ivory nav:hidden"
    >
      <div className="flex items-center justify-between gap-4 border-b border-rule bg-warm/[.96] px-[5vw] py-[10px] min-[800px]:py-3">
        <Brand locale={locale} dict={dict} onNavigate={onClose} />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="label -mr-[10px] inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-[10px] text-green"
        >
          {dict.menu.close}
        </button>
      </div>

      <div className="flex flex-col gap-10 px-[7vw] pb-12 pt-10">
        <nav aria-label={dict.a11y.mainNav}>
          <ul className="flex flex-col">
            {DRAWER_NAV.map((page) => {
              const href = localePath(locale, page);
              return (
                <li key={page} className="border-b border-line">
                  <Link
                    href={href}
                    onClick={onClose}
                    aria-current={pathname === href ? "page" : undefined}
                    className="flex min-h-[56px] items-center font-display text-[1.75rem] font-medium leading-tight text-ink no-underline aria-[current=page]:text-gold-text"
                  >
                    {dict.pages[page]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ExternalLink href={INSTAGRAM_URL} className="btn btn-primary">
            {dict.buttons.instagram}
          </ExternalLink>
          <ExternalLink href={WHATSAPP_URL} className="label inline-flex min-h-[44px] items-center text-green underline decoration-gold decoration-1 underline-offset-[6px]">
            {dict.buttons.whatsapp}
          </ExternalLink>
        </div>

        <LanguageSwitch locale={locale} dict={dict} className="-ml-[12px]" />
      </div>
    </div>
  );
}
