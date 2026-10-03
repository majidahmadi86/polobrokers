import { SellPage } from "@/components/pages/SellPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "sell");

export default function EnSellPage() {
  return <SellPage locale="en" />;
}
