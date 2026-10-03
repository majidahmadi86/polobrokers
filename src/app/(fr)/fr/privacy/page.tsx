import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "privacy");

export default function FrPrivacyPage() {
  return <PrivacyPage locale="fr" />;
}
