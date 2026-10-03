import type { Metadata } from "next";
import { NotFoundPage } from "@/components/NotFoundPage";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: getDictionary("en").notFound.title,
  robots: { index: false },
};

export default function ENNotFound() {
  return <NotFoundPage locale="en" />;
}
