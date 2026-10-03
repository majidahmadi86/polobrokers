import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "contact");

export default function FrContactPage() {
  return <StubPage locale="fr" page="contact" />;
}
