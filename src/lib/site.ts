// Single source for site-wide constants. Everything that links out reads from here.

export const SITE_URL = "https://polobrokers.com";
export const SITE_NAME = "Polo Brokers";

export const INSTAGRAM_HANDLE = "@polobrokers";
export const INSTAGRAM_URL = "https://www.instagram.com/polobrokers/";

// Digits only, international format, no plus sign (Swiss mobile, confirmed by Zac).
export const WHATSAPP_NUMBER = "41768295628";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
/** For tel: links. */
export const PHONE_TEL = `+${WHATSAPP_NUMBER}`;

/** A number as people read it. Swiss mobile: +41 76 829 56 28 (2 3 2 2); anything else: +digits. */
export function formatPhoneNumber(digits: string): string {
  if (digits.startsWith("41") && digits.length === 11) {
    return `+41 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }
  return `+${digits}`;
}
export const WHATSAPP_DISPLAY = formatPhoneNumber(WHATSAPP_NUMBER);
