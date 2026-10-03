import { ContactPage } from "@/components/pages/ContactPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "contact");

export default function EnContactPage() {
  return <ContactPage locale="en" />;
}
