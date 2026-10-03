import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "collection");

export default function EnCollectionPage() {
  return <StubPage locale="en" page="collection" />;
}
