import type { Dictionary } from "@/lib/i18n";
import { WIDTHS, mediaName, type MediaType } from "@/lib/ig/engine";
import { getFeed } from "@/lib/ig/feed";

// The latest six @polobrokers posts, each opening on Instagram. Images are the site's own WebP
// copies (/ig-media), so the browser never contacts an Instagram host. No feed: renders nothing.

function Marker({ type }: { type: MediaType }) {
  if (type === "IMAGE") return null;
  return (
    <span aria-hidden="true" className="absolute right-2 top-2 grid h-7 w-7 place-items-center bg-warm/90">
      {type === "VIDEO" ? (
        // Play triangle drawn in CSS (the play sign is an emoji code point, which the copy gate bans).
        <span className="ml-[2px] block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-green" />
      ) : (
        // Carousel: two stacked squares.
        <span className="relative block h-3 w-3">
          <span className="absolute left-[3px] top-0 h-[9px] w-[9px] border border-green" />
          <span className="absolute left-0 top-[3px] h-[9px] w-[9px] border border-green bg-warm" />
        </span>
      )}
    </span>
  );
}

export async function InstagramFeed({ dict }: { dict: Dictionary }) {
  const feed = await getFeed();
  if (!feed?.posts.length) return null;
  const t = dict.instagramFeed;
  return (
    <ul className="mx-auto mb-[38px] grid max-w-[1100px] grid-cols-2 gap-[6px] md:grid-cols-3">
      {feed.posts.map((post) => {
        const alt = post.alt || t.fallbackAlt;
        return (
          <li key={post.id} data-reveal>
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-ivory after:pointer-events-none after:absolute after:inset-0 after:border after:border-gold after:opacity-0 after:transition-opacity hover:after:opacity-100 focus-visible:after:opacity-100"
            >
              {/* Already optimized WebP served by the site itself (640 and 1080 px squares). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/ig-media/${mediaName(post.id, WIDTHS[0])}`}
                srcSet={WIDTHS.map((w) => `/ig-media/${mediaName(post.id, w)} ${w}w`).join(", ")}
                sizes="(min-width: 1100px) 366px, (min-width: 768px) 33vw, 50vw"
                alt={alt}
                width={WIDTHS[0]}
                height={WIDTHS[0]}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
              />
              <span className="sr-only">, {t.opens}</span>
              <Marker type={post.mediaType} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
