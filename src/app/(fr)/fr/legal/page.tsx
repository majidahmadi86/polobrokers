import { LegalPage } from "@/components/pages/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "legal");

export default function FrLegalPage() {
  return <LegalPage locale="fr" />;
}
