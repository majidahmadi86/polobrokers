import { HomePage } from "@/components/home/HomePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "home");

export default function EnHomePage() {
  return <HomePage locale="en" />;
}
