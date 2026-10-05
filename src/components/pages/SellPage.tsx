import { SellForm } from "@/components/SellForm";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServicesStrip } from "@/components/sections/ServicesStrip";
import { getDictionary, type Locale } from "@/lib/i18n";

// /sell: the Home sell copy as the page header, the services strip, then the WhatsApp form.
export function SellPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.home.sell;
  return (
    <>
      <PageHeader label={t.kicker} title={t.title}>
        <p data-reveal className="mt-8 max-w-[620px]">
          {t.body}
        </p>
        <ServicesStrip dict={dict} className="mt-8 max-w-[900px]" />
      </PageHeader>
      <section className="px-[7vw] py-[70px] min-[800px]:px-[8vw] min-[800px]:py-[90px]">
        <SellForm t={dict.sellForm} />
      </section>
    </>
  );
}
