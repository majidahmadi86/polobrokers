import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteDocument } from "@/components/SiteDocument";
import { rootMetadata } from "@/lib/seo";

export const metadata: Metadata = rootMetadata("fr");

export default function FRLayout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="fr">{children}</SiteDocument>;
}
