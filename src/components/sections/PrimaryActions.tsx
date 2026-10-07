import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import { INSTAGRAM_URL } from "@/lib/site";

// "Discover on Instagram" (green) + a two-line "Polo items to sell? / Contact us now" (ivory fill,
// ink text and border, so it reads on the hero photo too), linking to /sell. Large buttons, equal
// width: stacked full width on mobile, side by side from 800px. Hero and /about closing band.
export function PrimaryActions({ locale, dict, className = "" }: { locale: Locale; dict: Dictionary; className?: string }) {
  return (
    <div className={`mx-auto grid w-full max-w-[560px] grid-cols-1 gap-[10px] min-[800px]:grid-cols-2 ${className}`}>
      <ExternalLink href={INSTAGRAM_URL} className="btn btn-lg btn-primary whitespace-nowrap">
        {dict.buttons.discoverInstagram}
      </ExternalLink>
      <Link href={localePath(locale, "sell")} className="btn btn-lg flex-col gap-1 border-ink bg-ivory py-2 text-ink">
        <span className="text-[.66rem] font-normal tracking-[.12em]">{dict.buttons.sellPrompt.small}</span>
        <span className="whitespace-nowrap">{dict.buttons.sellPrompt.big}</span>
      </Link>
    </div>
  );
}
