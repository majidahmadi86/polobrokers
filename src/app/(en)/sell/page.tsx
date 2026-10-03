import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "sell");

export default function EnSellPage() {
  return <StubPage locale="en" page="sell" />;
}
