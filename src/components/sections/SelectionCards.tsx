import Image from "next/image";
import { ExternalLink } from "@/components/ExternalLink";
import type { Dictionary } from "@/lib/i18n";
import { INSTAGRAM_URL } from "@/lib/site";

// Men / Women / Children cards with ivory label bars, each opening Instagram. Made for the green
// band. One column below 768px, three from 768px (never 2 + 1).
// priorityFirst: on /collection the first card is the largest thing on a phone screen (LCP).
export function SelectionCards({ dict, priorityFirst = false }: { dict: Dictionary; priorityFirst?: boolean }) {
  const t = dict.home.selection;
  const cards = [
    {
      key: "men",
      label: t.men,
      alt: t.menAlt,
      // Zac's photo: face right of centre, upper third.
      src: "/images/men.jpg",
    },
    {
      key: "women",
      label: t.women,
      alt: t.womenAlt,
      // Zac's photo: face left of centre, upper third.
      src: "/images/women.jpg",
    },
    {
      key: "children",
      label: t.children,
      alt: t.childrenAlt,
      // Zac's photo: three children across the frame, faces in the middle band.
      src: "/images/children.jpg",
    },
  ];
  return (
    <ul className="mx-auto grid max-w-[1360px] grid-cols-1 gap-[15px] text-left md:grid-cols-3">
      {cards.map((card, index) => (
        <li key={card.key} data-reveal>
          <ExternalLink
            href={INSTAGRAM_URL}
            className="group relative block aspect-[2/3] overflow-hidden border-2 border-white no-underline"
          >
            <Image
              src={card.src}
              alt={card.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              quality={60}
              priority={priorityFirst && index === 0}
              className={`object-cover transition-transform duration-[350ms] group-hover:scale-[1.02] motion-reduce:transition-none`}
            />
            <span className="absolute inset-x-[18px] bottom-[18px] bg-warm/[.93] px-[18px] py-[14px] font-display text-[2rem] font-medium leading-tight text-green">
              {card.label}
            </span>
          </ExternalLink>
        </li>
      ))}
    </ul>
  );
}
