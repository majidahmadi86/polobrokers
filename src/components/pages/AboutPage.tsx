import { About } from "@/components/home/About";
import { PrimaryActions } from "@/components/sections/PrimaryActions";
import { ServicesStrip } from "@/components/sections/ServicesStrip";
import { getDictionary, type Locale } from "@/lib/i18n";

const subheading = "font-display text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.1]";
const lead = "font-display text-[1.5rem] font-medium leading-[1.4]";

// /about: the Home about block with its label, what we do, who we work with, closing actions.
export function AboutPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.aboutPage;
  return (
    <>
      <About dict={dict} label={dict.pages.about} />
      <section className="px-[7vw] py-[70px] min-[800px]:px-[8vw] min-[800px]:py-[90px]">
        <h2 data-reveal className={subheading}>
          {t.whatWeDo}
        </h2>
        <ServicesStrip dict={dict} className="my-8 max-w-[900px]" />
        <p data-reveal className={lead}>
          {t.whatWeDoLine}
        </p>
      </section>
      <section className="bg-warm px-[7vw] py-[70px] min-[800px]:px-[8vw] min-[800px]:py-[90px]">
        <h2 data-reveal className={subheading}>
          {t.whoWeWorkWith}
        </h2>
        <p data-reveal className={`mt-8 ${lead}`}>
          {t.whoLine}
        </p>
        <div aria-hidden="true" className="my-[27px] h-px w-[55px] bg-gold" />
        <p data-reveal>{t.shipping}</p>
      </section>
      <section className="px-[7vw] py-[70px] min-[800px]:py-[90px]">
        <PrimaryActions locale={locale} dict={dict} />
      </section>
    </>
  );
}
