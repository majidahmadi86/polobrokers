import { ExternalLink } from "@/components/ExternalLink";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProseBody, ProseSection } from "@/components/sections/ProseSection";
import { getDictionary, type Locale } from "@/lib/i18n";
import { LEGAL } from "@/lib/legal";
import { pageTitle } from "@/lib/seo";
import { INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/site";

const link = "text-green underline decoration-gold underline-offset-4";
const FIELDS = ["entityName", "entityAddress", "registrationNumber", "publicationDirector"] as const;

// /legal. Facts come from src/lib/legal.ts; a null fact renders nothing, not even its label.
export function LegalPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.legalPage;
  const known = FIELDS.filter((field) => LEGAL[field] !== null);
  return (
    <>
      <PageHeader title={pageTitle(dict, "legal")} />
      <ProseBody>
        <ProseSection title={t.publisher}>
          <p>{t.published}</p>
          {known.length > 0 && (
            <dl className="space-y-1">
              {known.map((field) => (
                <div key={field}>
                  <dt className="inline">{t.fields[field]} </dt>
                  <dd className="inline">{LEGAL[field]}</dd>
                </div>
              ))}
            </dl>
          )}
          <p>
            {t.contactLabel}{" "}
            <ExternalLink href={WHATSAPP_URL} className={link}>
              {dict.buttons.whatsapp}
            </ExternalLink>{" "}
            {t.and}{" "}
            <ExternalLink href={INSTAGRAM_URL} className={link}>
              {dict.buttons.instagram}
            </ExternalLink>
          </p>
        </ProseSection>
        <ProseSection title={t.hosting}>
          <p>{LEGAL.hosting[locale]}</p>
        </ProseSection>
        <ProseSection title={t.design}>
          <p>
            <ExternalLink href={LEGAL.design.url} className={`${link} inline-flex min-h-[44px] items-center`}>
              {LEGAL.design.name}
            </ExternalLink>
          </p>
        </ProseSection>
        <ProseSection title={t.trademarks}>
          <p>{t.trademarksText}</p>
        </ProseSection>
        <ProseSection title={t.intellectualProperty}>
          <p>{t.intellectualPropertyText}</p>
        </ProseSection>
        <p className="mt-12 font-body text-kicker uppercase tracking-kicker text-gold-text">
          {t.updated} {LEGAL.updated[locale]}
        </p>
      </ProseBody>
    </>
  );
}
