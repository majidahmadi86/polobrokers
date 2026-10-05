import Image from "next/image";
import { Logo } from "@/components/Logo";
import { PrimaryActions } from "@/components/sections/PrimaryActions";
import type { Dictionary, Locale } from "@/lib/i18n";

// Full-bleed photo with the ivory card. Desktop: card centred vertically on the left, as in the
// prototype. Below 800px: the card sits over the lower part of the photo, the photo shifted so the
// shop sign stays visible above it.
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.hero;
  return (
    <section className="relative flex min-h-[690px] items-end px-[5vw] pb-[35px] pt-[35px] min-[800px]:min-h-[740px] min-[800px]:items-center min-[800px]:px-[7vw] min-[800px]:py-[60px]">
      <Image
        // Zac's photo (portrait): the shop sign sits top right, clear of the card on desktop and above
        // it on mobile.
        src="/images/shop.jpg"
        alt={t.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center] min-[800px]:object-[center_8%]"
      />
      <div
        className="relative mx-auto w-full max-w-[470px] border border-panel-border bg-warm/[.96] px-[22px] py-[29px] shadow-[0_20px_50px_#1e1f1626] min-[800px]:mx-0 min-[800px]:px-[38px] min-[800px]:py-[42px]"
      >
        {/* Zac's sign is the card's focal point. It already reads "Ralph Lauren specialists /
            Original, second-hand, vintage", so the text tagline stays for screen readers and search only. */}
        <Logo variant="hero" priority className="mx-auto" />
        <p className="sr-only">
          {t.tagline[0]}
          <br />
          {t.tagline[1]}
        </p>
        <div className="mt-7">
          <PrimaryActions locale={locale} dict={dict} />
        </div>
      </div>
    </section>
  );
}
