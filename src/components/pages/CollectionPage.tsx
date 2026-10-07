import { Follow } from "@/components/home/Follow";
import { PageHeader } from "@/components/sections/PageHeader";
import { SelectionCards } from "@/components/sections/SelectionCards";
import { getDictionary, type Locale } from "@/lib/i18n";

// /collection: selection cards and the Instagram follow block only. No product pages, no item grid:
// every piece is posted and sold on Instagram.
export function CollectionPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader label={dict.pages.collection} title={dict.home.selection.title}>
        <p data-reveal className="mt-8 max-w-[620px] font-display text-[1.5rem] font-medium leading-[1.4]">
          {dict.collectionPage.line}
        </p>
      </PageHeader>
      <section className="bg-green px-[5vw] py-[70px] min-[800px]:py-[85px]">
        <SelectionCards dict={dict} priorityFirst />
      </section>
      <Follow dict={dict} />
    </>
  );
}
