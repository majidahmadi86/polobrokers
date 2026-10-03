import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "privacy");

export default function FrPrivacyPage() {
  return <StubPage locale="fr" page="privacy" />;
}
