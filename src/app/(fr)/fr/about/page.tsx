import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "about");

export default function FrAboutPage() {
  return <StubPage locale="fr" page="about" />;
}
