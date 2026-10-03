import { About } from "@/components/home/About";
import { Follow } from "@/components/home/Follow";
import { Hero } from "@/components/home/Hero";
import { Selection } from "@/components/home/Selection";
import { Sell } from "@/components/home/Sell";
import { RevealObserver } from "@/components/RevealObserver";
import { getDictionary, type Locale } from "@/lib/i18n";

// Prototype order: hero, about, selection, sell, follow. Same order stacked on mobile.
export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <>
      <Hero locale={locale} dict={dict} />
      <About dict={dict} />
      <Selection dict={dict} />
      <Sell dict={dict} />
      <Follow dict={dict} />
      <RevealObserver />
    </>
  );
}
