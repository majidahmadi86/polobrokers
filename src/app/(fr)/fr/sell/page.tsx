import { SellPage } from "@/components/pages/SellPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "sell");

export default function FrSellPage() {
  return <SellPage locale="fr" />;
}
