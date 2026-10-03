import { CollectionPage } from "@/components/pages/CollectionPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "collection");

// The Instagram feed is rendered here: regenerate at most hourly (it is also cached for an hour).
export const revalidate = 3600;

export default function EnCollectionPage() {
  return <CollectionPage locale="en" />;
}
