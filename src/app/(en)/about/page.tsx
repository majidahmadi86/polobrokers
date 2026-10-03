import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "about");

export default function EnAboutPage() {
  return <StubPage locale="en" page="about" />;
}
