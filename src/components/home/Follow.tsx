import { ExternalLink } from "@/components/ExternalLink";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import type { Dictionary } from "@/lib/i18n";
import { INSTAGRAM_URL } from "@/lib/site";

// Follow the collection. Static for now; the live grid arrives in <InstagramFeed />.
export function Follow({ dict }: { dict: Dictionary }) {
  const t = dict.home.follow;
  return (
    <section className="bg-warm px-[7vw] py-[100px] text-center">
      <p data-reveal className="font-body text-kicker uppercase tracking-kicker text-gold-text">
        {t.kicker}
      </p>
      <h2 data-reveal className="mx-auto mb-[38px] mt-[17px] max-w-[950px] [font-size:min(11vw,clamp(3rem,7vw,6.5rem))]">
        {t.title}
      </h2>
      <p data-reveal>
        <ExternalLink href={INSTAGRAM_URL} className="btn btn-primary">
          {t.button}
        </ExternalLink>
      </p>
      <InstagramFeed />
    </section>
  );
}
