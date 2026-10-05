import Link from "next/link";
import { Logo } from "@/components/Logo";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";

/** Zac's logo, linking home. Shared by the header and the drawer (same size, so no shift on open). */
export function Brand({ locale, dict, onNavigate }: { locale: Locale; dict: Dictionary; onNavigate?: () => void }) {
  return (
    <Link href={localePath(locale, "home")} aria-label={dict.a11y.home} onClick={onNavigate} className="flex min-h-[44px] items-center no-underline">
      <Logo variant="header" priority />
    </Link>
  );
}
