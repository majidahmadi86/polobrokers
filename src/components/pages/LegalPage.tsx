import { ExternalLink } from "@/components/ExternalLink";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProseBody, ProseSection } from "@/components/sections/ProseSection";
import { getDictionary, type Locale } from "@/lib/i18n";
import { LEGAL } from "@/lib/legal";
import { pageTitle } from "@/lib/seo";
import type { ReactNode } from "react";
import { INSTAGRAM_URL, WHATSAPP_URL, formatPhoneNumber } from "@/lib/site";

const link = "text-green underline decoration-gold underline-offset-4";

// /legal. Facts come from src/lib/legal.ts; a null fact renders nothing, not even its label.
export function LegalPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.legalPage;
  // Publisher facts in order; a null fact is left out entirely.
  const rows: [string, ReactNode][] = [];
  if (LEGAL.entityName) rows.push([t.fields.entityName, LEGAL.entityName]);
  if (LEGAL.entityAddress) rows.push([t.fields.entityAddress, LEGAL.entityAddress[locale]]);
  if (LEGAL.registrationNumber) rows.push([t.fields.registrationNumber, LEGAL.registrationNumber]);
  rows.push([
    t.fields.phone,
    <a key="tel" href={`tel:+${LEGAL.phone}`} className={`${link} inline-flex min-h-[44px] items-center`}>
      {formatPhoneNumber(LEGAL.phone)}
    </a>,
  ]);
  return (
    <>
      <PageHeader title={pageTitle(dict, "legal")} />
      <ProseBody>
        <ProseSection title={t.publisher}>
          <p>{t.published}</p>
          <dl className="space-y-1">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt className="inline">{label} </dt>
                <dd className="inline">{value}</dd>
              </div>
            ))}
          </dl>
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
