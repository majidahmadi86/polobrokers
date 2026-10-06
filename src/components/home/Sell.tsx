import Image from "next/image";
import { ExternalLink } from "@/components/ExternalLink";
import { ServicesStrip } from "@/components/sections/ServicesStrip";
import type { Dictionary } from "@/lib/i18n";
import { WHATSAPP_URL } from "@/lib/site";

// Photo left, ivory panel right. Stacked below 800px, photo first.
export function Sell({ dict }: { dict: Dictionary }) {
  const t = dict.home.sell;
  return (
    <section className="grid grid-cols-1 min-[800px]:grid-cols-2">
      <div className="relative min-h-[410px] min-[800px]:min-h-[600px]">
        <Image
          // Zac's shop photo (same file as the hero): the sign and the shoppers.
          src="/images/sell.jpg"
          alt={t.imageAlt}
          fill
          sizes="(min-width: 800px) 50vw, 100vw"
          className="object-cover object-[center_20%]"
        />
      </div>
      <div className="flex flex-col justify-center px-[7vw] py-[65px] min-[800px]:px-[8vw] min-[800px]:py-[80px]">
        <p data-reveal className="font-body text-sub uppercase tracking-sub text-gold-text">
          {t.kicker}
        </p>
        <h2 data-reveal className="mb-[26px] mt-[10px]">
          {t.title}
        </h2>
        <p data-reveal>{t.body}</p>
        <ServicesStrip dict={dict} className="my-7" />
        <p data-reveal>
          <ExternalLink href={WHATSAPP_URL} className="btn btn-gold">
            {t.button}
          </ExternalLink>
        </p>
      </div>
    </section>
  );
}
