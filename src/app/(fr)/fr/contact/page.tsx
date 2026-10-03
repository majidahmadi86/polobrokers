import { ContactPage } from "@/components/pages/ContactPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "contact");

export default function FrContactPage() {
  return <ContactPage locale="fr" />;
}
