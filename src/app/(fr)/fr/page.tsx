import { HomePage } from "@/components/home/HomePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "home");

// The Instagram feed is rendered here: regenerate at most hourly (it is also cached for an hour).
export const revalidate = 3600;

export default function FrHomePage() {
  return <HomePage locale="fr" />;
}
