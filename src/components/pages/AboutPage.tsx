import Image from "next/image";
import { About } from "@/components/home/About";
import { PrimaryActions } from "@/components/sections/PrimaryActions";
import { SeparatedLine } from "@/components/sections/SeparatedLine";
import { ServicesStrip } from "@/components/sections/ServicesStrip";
import { getDictionary, type Locale } from "@/lib/i18n";

const subheading = "font-display text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.1]";
const smallCaps = "font-body text-kicker uppercase tracking-kicker text-gold-text";

// /about: the Home about block with its label, an image band, what we do, who we work with,
// closing actions.
export function AboutPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.aboutPage;
  return (
    <>
      <About dict={dict} label={dict.pages.about} />

      <div className="relative h-[360px] min-[800px]:h-[520px]">
        <Image
          // TEMP: replace with Zac original before launch. (Same file as Home Sell, cropped higher, from the faces down.)
          src="/images/temp-sell.jpg"
          alt={dict.home.sell.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-[center_8%]"
        />
      </div>

      <section className="px-[7vw] py-[70px] text-center min-[800px]:px-[8vw] min-[800px]:py-[90px]">
        <h2 data-reveal className={subheading}>
          {t.whatWeDo}
        </h2>
        {/* Same measure as the strip in the Home Sell panel. */}
        <ServicesStrip dict={dict} className="mx-auto mb-6 mt-10 max-w-[34rem]" />
        <SeparatedLine text={t.whatWeDoLine} className={smallCaps} />
      </section>

      <section className="bg-warm px-[7vw] py-[70px] text-center min-[800px]:px-[8vw] min-[800px]:py-[90px]">
        <h2 data-reveal className={subheading}>
          {t.whoWeWorkWith}
        </h2>
        <SeparatedLine text={t.whoLine} className="mx-auto mt-8 max-w-[60rem] font-display text-[1.5rem] font-medium leading-[1.4]" />
        <div aria-hidden="true" className="mx-auto mb-5 mt-9 h-px w-[55px] bg-gold" />
        <p data-reveal className={smallCaps}>
          {t.shipping}
        </p>
      </section>

      <section className="px-[7vw] py-[70px] min-[800px]:py-[90px]">
        <PrimaryActions locale={locale} dict={dict} />
      </section>
    </>
  );
}
