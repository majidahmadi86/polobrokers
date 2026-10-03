import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "contact");

export default function EnContactPage() {
  return <StubPage locale="en" page="contact" />;
}
