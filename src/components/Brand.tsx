import Link from "next/link";
import { Monogram } from "@/components/Monogram";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";

/** The wordmark: boxed PB + letterspaced POLO BROKERS, linking home. Shared by the header and the drawer. */
export function Brand({ locale, dict, onNavigate }: { locale: Locale; dict: Dictionary; onNavigate?: () => void }) {
  return (
    <Link
      href={localePath(locale, "home")}
      aria-label={dict.a11y.home}
      onClick={onNavigate}
      className="flex min-h-[44px] items-center gap-3 font-display text-[.95rem] font-medium tracking-brand text-ink no-underline [--mono:34px] min-[800px]:text-brand min-[800px]:[--mono:42px]"
    >
      <Monogram size="var(--mono)" className="text-green" />
      <span>POLO BROKERS</span>
    </Link>
  );
}
