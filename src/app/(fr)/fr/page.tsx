import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "home");

export default function FrHomePage() {
  return <StubPage locale="fr" page="home" />;
}
