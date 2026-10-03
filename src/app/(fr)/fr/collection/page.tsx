import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "collection");

export default function FrCollectionPage() {
  return <StubPage locale="fr" page="collection" />;
}
