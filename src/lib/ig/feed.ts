import "server-only";
import { unstable_cache } from "next/cache";
import { IG_API_VERSION, igConfig } from "./config";
import { buildFeed, type Feed } from "./engine";

export const FEED_TAG = "ig-feed";
/** Pages that show the feed; revalidated on connect. */
export const FEED_PATHS = ["/", "/fr", "/collection", "/fr/collection"];

async function loadFeed(): Promise<Feed | null> {
  const cfg = igConfig();
  try {
    return await buildFeed({
      dataDir: cfg.dataDir,
      mock: cfg.mock,
      fixturesDir: cfg.fixturesDir,
      appSecret: cfg.appSecret,
      graphBase: cfg.graphBase,
      apiVersion: IG_API_VERSION,
      // Next caches server fetches too: give them the same period as the feed itself. ("no-store"
      // here would make a static page dynamic at build time and drop the feed.)
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: REVALIDATE } }),
      now: Date.now,
      log: (message) => console.warn(message),
      beholdUrl: cfg.beholdUrl,
      expectedUsername: cfg.expectedUsername,
    });
  } catch (err) {
    // buildFeed never throws; this only guards the page against the unexpected.
    console.warn(`[ig] feed unavailable: ${(err as Error).message}`);
    return null;
  }
}

// Next keeps this cache in .next/cache across builds: the key carries the mode and the data folder,
// so a mock feed can never be served in live mode (or another folder's feed).
// The source and the Behold URL are in the key too, so adding BEHOLD_FEED_URL takes effect on the
// next build without any manual cache step.
const cfg = igConfig();
const CACHE_KEY = [FEED_TAG, cfg.mock ? "mock" : cfg.beholdUrl ? "behold" : "live", cfg.dataDir, cfg.beholdUrl || ""];
// Behold budget: the free plan allows 1,200 views a month and every fetch is one view. Refetching
// every 6 hours is about 4 a day, 120 a month (plus a few per deploy, one per build worker); Behold
// itself only refreshes the feed once a day. Meta has no such limit: one hour.
const REVALIDATE = cfg.beholdUrl && !cfg.mock ? 6 * 3600 : 3600;

/** The latest posts, cached (6h Behold, 1h Meta). Null means: show no feed (the page keeps its fallback). */
export const getFeed = unstable_cache(loadFeed, CACHE_KEY, { revalidate: REVALIDATE, tags: [FEED_TAG] });
