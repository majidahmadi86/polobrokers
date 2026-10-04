import { About } from "@/components/home/About";
import { Follow } from "@/components/home/Follow";
import { Hero } from "@/components/home/Hero";
import { Selection } from "@/components/home/Selection";
import { Sell } from "@/components/home/Sell";
import { getDictionary, type Locale } from "@/lib/i18n";
import { INSTAGRAM_URL, PHONE_TEL, SITE_NAME, SITE_URL } from "@/lib/site";

// Organization structured data, Home only. Only facts we have (from Zac): phone and town, nothing more.
// Logo: the 180px monogram icon (src/app/apple-icon.png), served at /apple-icon.png.
const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/apple-icon.png`,
  telephone: PHONE_TEL,
  address: { "@type": "PostalAddress", postalCode: "1870", addressLocality: "Monthey", addressCountry: "CH" },
  sameAs: [INSTAGRAM_URL],
};

// Prototype order: hero, about, selection, sell, follow. Same order stacked on mobile.
export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }} />
      <Hero locale={locale} dict={dict} />
      <About dict={dict} />
      <Selection dict={dict} />
      <Sell dict={dict} />
      <Follow dict={dict} />
    </>
  );
}
