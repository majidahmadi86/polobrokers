import { AboutPage } from "@/components/pages/AboutPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "about");

export default function EnAboutPage() {
  return <AboutPage locale="en" />;
}
