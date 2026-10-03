import type { Dictionary } from "@/lib/i18n";

// "Polo is our business." on the left, lead line, gold rule and paragraph on the right. Stacked below 800px.
export function About({ dict }: { dict: Dictionary }) {
  const t = dict.home.about;
  return (
    <section className="grid grid-cols-1 gap-10 bg-warm px-[7vw] py-[70px] min-[800px]:grid-cols-[.9fr_1.1fr] min-[800px]:gap-[8vw] min-[800px]:px-[8vw] min-[800px]:py-[90px]">
      <h1 data-reveal>
        {t.title[0]}
        <br />
        {t.title[1]}
      </h1>
      <div data-reveal className="max-w-[620px]">
        <p className="mt-0 font-display text-[1.5rem] font-medium leading-[1.4]">{t.lead}</p>
        <div aria-hidden="true" className="my-[27px] h-px w-[55px] bg-gold" />
        <p>{t.body}</p>
      </div>
    </section>
  );
}
