import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "legal");

export default function EnLegalPage() {
  return <StubPage locale="en" page="legal" />;
}
