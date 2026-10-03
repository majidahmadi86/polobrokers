import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "legal");

export default function FrLegalPage() {
  return <StubPage locale="fr" page="legal" />;
}
