import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "privacy");

export default function EnPrivacyPage() {
  return <StubPage locale="en" page="privacy" />;
}
