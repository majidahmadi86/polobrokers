import { AboutPage } from "@/components/pages/AboutPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("fr", "about");

export default function FrAboutPage() {
  return <AboutPage locale="fr" />;
}
