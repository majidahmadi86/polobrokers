import type { Dictionary } from "@/lib/i18n";
import { WHATSAPP_NUMBER } from "@/lib/site";

export type SellValues = {
  name: string;
  contact: string;
  /** Visible label of the chosen department, in the page language. */
  department: string;
  /** Visible label of the chosen category, in the page language. */
  category: string;
  description: string;
};

/** The WhatsApp message, one line per field, in the page's language. */
export function sellMessage(dict: Dictionary, v: SellValues): string {
  const m = dict.sellForm.message;
  return [
    m.intro,
    `${m.name} ${v.name.trim()}`,
    `${m.contact} ${v.contact.trim()}`,
    `${m.department} ${v.department}`,
    `${m.category} ${v.category}`,
    `${m.details} ${v.description.trim()}`,
    m.outro,
  ].join("\n");
}

export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
