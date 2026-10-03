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
      fetch,
      now: Date.now,
      log: (message) => console.warn(message),
    });
  } catch (err) {
    // buildFeed never throws; this only guards the page against the unexpected.
    console.warn(`[ig] feed unavailable: ${(err as Error).message}`);
    return null;
  }
}

// Next keeps this cache in .next/cache across builds: the key carries the mode and the data folder,
// so a mock feed can never be served in live mode (or another folder's feed).
const cfg = igConfig();
const CACHE_KEY = [FEED_TAG, cfg.mock ? "mock" : "live", cfg.dataDir];

/** The latest posts, cached one hour. Null means: show no feed (the page keeps its fallback). */
export const getFeed = unstable_cache(loadFeed, CACHE_KEY, { revalidate: 3600, tags: [FEED_TAG] });
