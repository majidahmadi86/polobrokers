import { getDictionary, type Locale, type PageKey } from "@/lib/i18n";

// Commit 1 stub: the page title only. Page copy arrives in later commits.
export function StubPage({ locale, page }: { locale: Locale; page: PageKey }) {
  const dict = getDictionary(locale);
  return (
    <div className="px-[8vw] py-[90px]">
      <h1>{dict.pages[page]}</h1>
    </div>
  );
}
