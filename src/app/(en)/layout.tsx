import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteDocument } from "@/components/SiteDocument";
import { rootMetadata } from "@/lib/seo";

export const metadata: Metadata = rootMetadata("en");

export default function ENLayout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="en">{children}</SiteDocument>;
}
