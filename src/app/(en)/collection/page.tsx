import { CollectionPage } from "@/components/pages/CollectionPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "collection");

export default function EnCollectionPage() {
  return <CollectionPage locale="en" />;
}
