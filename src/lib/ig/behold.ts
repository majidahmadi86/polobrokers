import "server-only";
import type { ApiMedia, MediaType } from "./engine";

// Behold JSON feed (behold.so), the primary Instagram source: Zac connects @polobrokers on Behold
// once and the site reads its feed URL (BEHOLD_FEED_URL). Shape per behold.so/docs/json-feeds:
//   { username, ..., posts: [{ id, timestamp, permalink, mediaType, mediaUrl, thumbnailUrl (VIDEO),
//     sizes: { small, medium, large, full: { mediaUrl, width, height } }, caption, prunedCaption,
//     altText, children (CAROUSEL_ALBUM), ... }] }
// Free plan: 6 posts, refreshed daily, 1,200 views a month; every server fetch is one view.

export const BEHOLD_PREFIX = "https://feeds.behold.so/";
const MIN_WIDTH = 1080;

type BeholdSize = { mediaUrl: string; width: number; height: number };
export type BeholdPost = {
  id: string;
  timestamp?: string;
  permalink: string;
  mediaType: MediaType;
  mediaUrl?: string;
  thumbnailUrl?: string;
  sizes?: Partial<Record<"small" | "medium" | "large" | "full", BeholdSize>>;
  caption?: string;
};
export type BeholdFeed = { username?: string; posts?: BeholdPost[] };

/** Only Behold's own feed host is accepted (allowLocal: the gates' stand-in on 127.0.0.1). */
export function beholdUrlAllowed(url: string | undefined | null, allowLocal = false): boolean {
  if (!url) return false;
  if (url.startsWith(BEHOLD_PREFIX) && url.length > BEHOLD_PREFIX.length) return true;
  return allowLocal && url.startsWith("http://127.0.0.1:");
}

/** The image to cache: VIDEO uses its thumbnail; otherwise the largest size if it is at least
 * 1080px wide, else the original mediaUrl. */
export function beholdImage(post: BeholdPost): string | null {
  if (post.mediaType === "VIDEO") return post.thumbnailUrl || null;
  const sizes = Object.values(post.sizes || {}).filter((s): s is BeholdSize => Boolean(s?.mediaUrl && s.width));
  const largest = sizes.sort((a, b) => b.width - a.width)[0];
  if (largest && largest.width >= MIN_WIDTH) return largest.mediaUrl;
  return post.mediaUrl || largest?.mediaUrl || null;
}

/** Behold feed to the engine's media shape. Throws (nothing stored) if the feed is not @expected. */
export function mapBehold(feed: BeholdFeed, expectedUsername: string): ApiMedia[] {
  const username = String(feed?.username || "").toLowerCase();
  if (username !== expectedUsername) throw new Error(`Behold feed is @${username || "unknown"}, not @${expectedUsername}`);
  if (!Array.isArray(feed.posts)) throw new Error("Behold feed without posts");
  return feed.posts.map((post) => {
    const image = beholdImage(post) || undefined;
    return {
      id: post.id,
      caption: post.caption,
      media_type: post.mediaType,
      // The engine picks thumbnail_url for VIDEO and media_url otherwise: both point at the chosen image.
      media_url: image,
      thumbnail_url: image,
      permalink: post.permalink,
      timestamp: post.timestamp,
    };
  });
}
