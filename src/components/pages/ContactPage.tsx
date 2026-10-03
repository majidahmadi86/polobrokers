import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { PageHeader } from "@/components/sections/PageHeader";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/site";

// /contact: WhatsApp and Instagram only. No email, no map, no address.
export function ContactPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.contactPage;
  const tiles = [
    { key: "whatsapp", label: dict.buttons.whatsapp, value: WHATSAPP_DISPLAY, href: WHATSAPP_URL, button: t.whatsappButton },
    { key: "instagram", label: dict.buttons.instagram, value: INSTAGRAM_HANDLE, href: INSTAGRAM_URL, button: t.instagramButton },
  ];
  return (
    <>
      <PageHeader label={dict.pages.contact} title={t.title}>
        <p data-reveal className="mt-8 max-w-[620px] font-display text-[1.5rem] font-medium leading-[1.4]">
          {t.line}
        </p>
      </PageHeader>
      <section className="px-[7vw] py-[70px] min-[800px]:px-[8vw] min-[800px]:py-[90px]">
        <ul className="grid grid-cols-1 gap-[15px] md:grid-cols-2">
          {tiles.map((tile) => (
            <li
              key={tile.key}
              data-reveal
              className="flex flex-col items-center border border-line bg-warm px-6 py-12 text-center min-[800px]:py-16"
            >
              <p className="font-body text-kicker uppercase tracking-kicker text-gold-text">{tile.label}</p>
              <p className="mb-8 mt-4 whitespace-nowrap font-display text-[clamp(1.6rem,6vw,2.4rem)] font-medium leading-tight">
                {tile.value}
              </p>
              <ExternalLink href={tile.href} className="btn btn-primary">
                {tile.button}
              </ExternalLink>
            </li>
          ))}
        </ul>
        <p data-reveal className="mt-10 text-center">
          {t.sellPrompt.before}
          <Link href={localePath(locale, "sell")} className="text-green underline decoration-gold underline-offset-4">
            {t.sellPrompt.link}
          </Link>
          {t.sellPrompt.after}
        </p>
      </section>
    </>
  );
}
