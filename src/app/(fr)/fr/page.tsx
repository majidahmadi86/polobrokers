import { HomePage } from "@/components/home/HomePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "home");

export default function FrHomePage() {
  return <HomePage locale="fr" />;
}
