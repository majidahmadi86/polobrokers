import Image from "next/image";
import { ExternalLink } from "@/components/ExternalLink";
import type { Dictionary } from "@/lib/i18n";
import { INSTAGRAM_URL } from "@/lib/site";

// Green band with Men / Women / Children cards, each opening Instagram. One column below 768px,
// three from 768px (never 2 + 1).
export function Selection({ dict }: { dict: Dictionary }) {
  const t = dict.home.selection;
  const cards = [
    {
      key: "men",
      label: t.men,
      alt: t.menAlt,
      // TEMP: replace with Zac original before launch. (Left crop of the prototype's shared portrait.)
      src: "/images/temp-men.jpg",
      position: "object-[center_12%]",
    },
    {
      key: "women",
      label: t.women,
      alt: t.womenAlt,
      // TEMP: replace with Zac original before launch. (Right crop of the prototype's shared portrait.)
      src: "/images/temp-women.jpg",
      position: "object-[center_15%]",
    },
    {
      key: "children",
      label: t.children,
      alt: t.childrenAlt,
      // TEMP: replace with Zac original before launch.
      src: "/images/temp-children.jpg",
      position: "object-[center_25%]",
    },
  ];
  return (
    <section className="bg-green px-[5vw] pb-[95px] pt-[85px] text-center text-white">
      <p data-reveal className="font-body text-kicker uppercase tracking-kicker text-gold-pale">
        {t.kicker}
      </p>
      <h2 data-reveal className="mb-[42px] mt-[15px]">
        {t.title}
      </h2>
      <ul className="mx-auto grid max-w-[1360px] grid-cols-1 gap-[15px] text-left md:grid-cols-3">
        {cards.map((card) => (
          <li key={card.key} data-reveal>
            <ExternalLink
              href={INSTAGRAM_URL}
              className="group relative block min-h-[450px] overflow-hidden border-2 border-white no-underline md:min-h-[500px]"
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className={`object-cover ${card.position} transition-transform duration-[350ms] group-hover:scale-[1.02] motion-reduce:transition-none`}
              />
              <span className="absolute inset-x-[18px] bottom-[18px] bg-warm/[.93] px-[18px] py-[14px] font-display text-[2rem] font-medium leading-tight text-green">
                {card.label}
              </span>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
