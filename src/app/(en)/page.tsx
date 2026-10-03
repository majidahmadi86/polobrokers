import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "home");

export default function EnHomePage() {
  return <StubPage locale="en" page="home" />;
}
