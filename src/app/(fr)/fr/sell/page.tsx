import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "sell");

export default function FrSellPage() {
  return <StubPage locale="fr" page="sell" />;
}
