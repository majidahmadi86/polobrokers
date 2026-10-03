import { SelectionCards } from "@/components/sections/SelectionCards";
import type { Dictionary } from "@/lib/i18n";

// Green band: label, heading, Men / Women / Children cards.
export function Selection({ dict }: { dict: Dictionary }) {
  const t = dict.home.selection;
  return (
    <section className="bg-green px-[5vw] pb-[95px] pt-[85px] text-center text-white">
      <p data-reveal className="font-body text-kicker uppercase tracking-kicker text-gold-pale">
        {t.kicker}
      </p>
      <h2 data-reveal className="mb-[42px] mt-[15px]">
        {t.title}
      </h2>
      <SelectionCards dict={dict} />
    </section>
  );
}
