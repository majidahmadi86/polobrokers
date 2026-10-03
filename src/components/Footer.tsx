import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { localePath, type Dictionary, type Locale, type PageKey } from "@/lib/i18n";
import { INSTAGRAM_URL, SITE_NAME, WHATSAPP_URL } from "@/lib/site";

const FOOTER_NAV: PageKey[] = ["about", "collection", "sell", "contact", "legal", "privacy"];

// Green footer as in the prototype. Carries Instagram and WhatsApp, so both are on every page, and
// the disclaimer, which stays.
export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-footer-bg px-[6vw] py-8 text-footer text-footer-text">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 min-[800px]:flex-row min-[800px]:items-center min-[800px]:justify-between">
        <nav aria-label={dict.a11y.footerNav}>
          <ul className="flex flex-wrap gap-x-6">
            {FOOTER_NAV.map((page) => (
              <li key={page}>
                <Link href={localePath(locale, page)} className="label inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-footer no-underline hover:text-white">
                  {dict.pages[page]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="flex gap-x-6">
          <li>
            <ExternalLink href={INSTAGRAM_URL} className="label inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-footer no-underline hover:text-white">
              {dict.buttons.instagram}
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={WHATSAPP_URL} className="label inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-footer no-underline hover:text-white">
              {dict.buttons.whatsapp}
            </ExternalLink>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-3 pt-5 min-[800px]:flex-row min-[800px]:justify-between min-[800px]:gap-[30px]">
        <p>
          © {year} {SITE_NAME}
        </p>
        <p className="max-w-[650px] min-[800px]:text-right">{dict.disclaimer}</p>
      </div>
    </footer>
  );
}
