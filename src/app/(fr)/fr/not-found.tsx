import type { Metadata } from "next";
import { NotFoundPage } from "@/components/NotFoundPage";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: getDictionary("fr").notFound.title,
  robots: { index: false },
};

export default function FRNotFound() {
  return <NotFoundPage locale="fr" />;
}
