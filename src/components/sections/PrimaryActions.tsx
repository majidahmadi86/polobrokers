import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import { INSTAGRAM_URL } from "@/lib/site";

// "Discover on Instagram" (green, Instagram) + "Sell to us" (outline, /sell). Hero and /about closing band.
// onPhoto (the hero): "Sell to us" gets a solid ivory fill and ink border, so it never sits
// transparent on the photo.
export function PrimaryActions({ locale, dict, className = "", onPhoto = false }: { locale: Locale; dict: Dictionary; className?: string; onPhoto?: boolean }) {
  return (
    <div className={`flex flex-wrap justify-center gap-[10px] ${className}`}>
      <ExternalLink href={INSTAGRAM_URL} className="btn btn-primary">
        {dict.buttons.discoverInstagram}
      </ExternalLink>
      <Link href={localePath(locale, "sell")} className={onPhoto ? "btn border-ink bg-ivory text-ink" : "btn text-green"}>
        {dict.buttons.sellToUs}
      </Link>
    </div>
  );
}
