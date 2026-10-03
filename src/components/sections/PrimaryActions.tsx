import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import { INSTAGRAM_URL } from "@/lib/site";

// "Discover on Instagram" (green, Instagram) + "Sell to us" (outline, /sell). Hero and /about closing band.
export function PrimaryActions({ locale, dict, className = "" }: { locale: Locale; dict: Dictionary; className?: string }) {
  return (
    <div className={`flex flex-wrap justify-center gap-[10px] ${className}`}>
      <ExternalLink href={INSTAGRAM_URL} className="btn btn-primary">
        {dict.buttons.discoverInstagram}
      </ExternalLink>
      <Link href={localePath(locale, "sell")} className="btn text-green">
        {dict.buttons.sellToUs}
      </Link>
    </div>
  );
}
