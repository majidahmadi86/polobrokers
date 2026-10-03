import { CollectionPage } from "@/components/pages/CollectionPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "collection");

export default function FrCollectionPage() {
  return <CollectionPage locale="fr" />;
}
