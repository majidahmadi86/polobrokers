import Image from "next/image";
import { ExternalLink } from "@/components/ExternalLink";
import type { Dictionary } from "@/lib/i18n";
import { WHATSAPP_URL } from "@/lib/site";

// Photo left, ivory panel right. Stacked below 800px, photo first.
export function Sell({ dict }: { dict: Dictionary }) {
  const t = dict.home.sell;
  return (
    <section className="grid grid-cols-1 min-[800px]:grid-cols-2">
      <div className="relative min-h-[410px] min-[800px]:min-h-[600px]">
        <Image
          // TEMP: replace with Zac original before launch.
          src="/images/temp-sell.jpg"
          alt={t.imageAlt}
          fill
          sizes="(min-width: 800px) 50vw, 100vw"
          className="object-cover"
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
        <ul data-reveal className="my-7 grid grid-cols-1 border-y border-line min-[800px]:grid-cols-3">
          {t.features.map((feature) => (
            <li
              key={feature.title}
              className="border-b border-line p-4 text-center last:border-0 min-[800px]:border-b-0 min-[800px]:border-r min-[800px]:last:border-r-0"
            >
              <strong className="block font-display text-[1.25rem] font-medium">{feature.title}</strong>
              <small className="text-[.83rem] uppercase tracking-[.08em]">{feature.note}</small>
            </li>
          ))}
        </ul>
        <p data-reveal>
          <ExternalLink href={WHATSAPP_URL} className="btn btn-gold">
            {t.button}
          </ExternalLink>
        </p>
      </div>
    </section>
  );
}
