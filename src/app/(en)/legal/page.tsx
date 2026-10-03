import { LegalPage } from "@/components/pages/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "legal");

export default function EnLegalPage() {
  return <LegalPage locale="en" />;
}
