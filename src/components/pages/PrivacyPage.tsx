import { PageHeader } from "@/components/sections/PageHeader";
import { ProseBody, ProseSection } from "@/components/sections/ProseSection";
import { getDictionary, type Locale } from "@/lib/i18n";
import { LEGAL } from "@/lib/legal";
import { pageTitle } from "@/lib/seo";

// /privacy. Kept true by scripts/check-privacy.mjs (no third-party request, no cookie, no storage).
// The data controller line appears only once the entity name is known.
export function PrivacyPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.privacyPage;
  return (
    <>
      <PageHeader title={pageTitle(dict, "privacy")} />
      <ProseBody>
        {t.sections.map((section) => (
          <ProseSection key={section.title} title={section.title}>
            <p>{section.body}</p>
          </ProseSection>
        ))}
        {LEGAL.entityName !== null && (
          <p className="mt-12">
            {t.controller} {LEGAL.entityName}
          </p>
        )}
        <p className="mt-12 font-body text-kicker uppercase tracking-kicker text-gold-text">
          {t.updated} {LEGAL.updated[locale]}
        </p>
      </ProseBody>
    </>
  );
}
