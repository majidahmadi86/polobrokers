import "server-only";
import { readdir, readFile, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { sanitizeCaption } from "./sanitize";
import { EXPIRY_WARNING_DAYS, daysUntil, readToken, shouldRefresh, writeAtomic, writeToken } from "./token";

// The feed engine: token, refresh, latest media, self-cached images. Pure Node (no Next), every
// outside dependency passed in, so the gates can drive it directly.
// Never throws: any failure logs one line and returns the last good feed on disk, or null.

export type MediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
export type FeedPost = {
  id: string;
  permalink: string;
  mediaType: MediaType;
  /** Sanitized caption, or null (the UI then uses its language's fallback). */
  alt: string | null;
};
export type Feed = { posts: FeedPost[]; updatedAt: string; stale?: boolean };
export type FeedStatus = { lastFeedOk: string | null; lastError: string | null; lastErrorAt: string | null; warning: string | null };

export type EngineDeps = {
  dataDir: string;
  mock: boolean;
  fixturesDir: string;
  appSecret: string;
  graphBase: string;
  apiVersion: string;
  fetch: typeof fetch;
  now: () => number;
  log: (message: string) => void;
};

type ApiMedia = {
  id: string;
  caption?: string;
  media_type: MediaType;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp?: string;
};

export const FEED_SIZE = 6;
export const WIDTHS = [640, 1080] as const;
const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
const ID = /^[0-9A-Za-z_]+$/;
/** The files the /ig-media route may serve, and nothing else. */
export const MEDIA_FILE = /^[0-9A-Za-z_]+-(640|1080)[.]webp$/;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export const mediaDir = (dataDir: string) => path.join(dataDir, "media");
const feedFile = (dataDir: string) => path.join(dataDir, "feed.json");
const statusFile = (dataDir: string) => path.join(dataDir, "status.json");
export const mediaName = (id: string, width: number) => `${id}-${width}.webp`;

export async function readStatus(dataDir: string): Promise<FeedStatus> {
  try {
    return JSON.parse(await readFile(statusFile(dataDir), "utf8")) as FeedStatus;
  } catch {
    return { lastFeedOk: null, lastError: null, lastErrorAt: null, warning: null };
  }
}

async function writeStatus(dataDir: string, patch: Partial<FeedStatus>) {
  const next = { ...(await readStatus(dataDir)), ...patch };
  await writeAtomic(statusFile(dataDir), JSON.stringify(next, null, 2)).catch(() => {});
}

async function exists(file: string) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

/** The last good feed on disk, if its images are still there. */
export async function readStaleFeed(dataDir: string): Promise<Feed | null> {
  try {
    const feed = JSON.parse(await readFile(feedFile(dataDir), "utf8")) as Feed;
    const complete = await Promise.all(feed.posts.map((p) => exists(path.join(mediaDir(dataDir), mediaName(p.id, WIDTHS[0])))));
    return feed.posts.length && complete.every(Boolean) ? { ...feed, stale: true } : null;
  } catch {
    return null;
  }
}

/** VIDEO uses its thumbnail; IMAGE and CAROUSEL_ALBUM (its cover) use media_url. */
export function imageSource(m: ApiMedia): string | null {
  if (m.media_type === "VIDEO") return m.thumbnail_url || null;
  return m.media_url || m.thumbnail_url || null;
}

async function getJson(d: EngineDeps, url: string): Promise<unknown> {
  const res = await d.fetch(url, { signal: AbortSignal.timeout(15000), cache: "no-store" });
  if (!res.ok) {
    // The error body can echo the request; never let the token reach a log line.
    throw new Error(`HTTP ${res.status} from ${new URL(url).pathname}`);
  }
  return res.json();
}

async function loadImage(d: EngineDeps, source: string): Promise<Buffer> {
  // Fixtures name local files ("file:public/images/..."); only ever honoured in mock mode.
  if (source.startsWith("file:")) {
    if (!d.mock) throw new Error("local image source outside mock mode");
    return readFile(path.resolve(source.slice(5)));
  }
  const res = await d.fetch(source, { signal: AbortSignal.timeout(20000), cache: "no-store" });
  if (!res.ok) throw new Error(`image HTTP ${res.status}`);
  const data = Buffer.from(await res.arrayBuffer());
  if (data.length > MAX_IMAGE_BYTES) throw new Error("image too large");
  return data;
}

async function latestMedia(d: EngineDeps): Promise<ApiMedia[]> {
  if (d.mock) {
    const fixture = JSON.parse(await readFile(path.join(d.fixturesDir, "media.json"), "utf8")) as { data: ApiMedia[] };
    return fixture.data;
  }
  let token = await readToken(d.dataDir);
  if (!token) throw new Error("no token (connect Instagram first)");
  if (Date.parse(token.expiresAt) <= d.now()) throw new Error("token expired (connect Instagram again)");

  if (shouldRefresh(token, d.now())) {
    try {
      const url = `${d.graphBase}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token.token)}`;
      const body = (await getJson(d, url)) as { access_token?: string; expires_in?: number };
      if (!body.access_token || !body.expires_in) throw new Error("refresh answered without a token");
      token = {
        ...token,
        token: body.access_token,
        obtainedAt: new Date(d.now()).toISOString(),
        expiresAt: new Date(d.now() + body.expires_in * 1000).toISOString(),
      };
      await writeToken(d.dataDir, token);
      d.log(`[ig] token refreshed, valid until ${token.expiresAt}`);
      await writeStatus(d.dataDir, { warning: null });
    } catch (err) {
      const left = daysUntil(token.expiresAt, d.now());
      const message = `token refresh failed (${(err as Error).message}), ${left} days left`;
      if (left < EXPIRY_WARNING_DAYS) {
        const warning = `INSTAGRAM TOKEN EXPIRES IN ${left} DAYS AND COULD NOT BE REFRESHED. Reconnect via /api/ig/connect.`;
        d.log(`[ig] WARNING ${warning}`);
        await writeStatus(d.dataDir, { warning });
      } else {
        d.log(`[ig] ${message}`);
      }
    }
  }

  const url = `${d.graphBase}/${d.apiVersion}/${encodeURIComponent(token.userId)}/media?fields=${FIELDS}&limit=${FEED_SIZE}&access_token=${encodeURIComponent(token.token)}`;
  const body = (await getJson(d, url)) as { data?: ApiMedia[] };
  if (!Array.isArray(body.data)) throw new Error("media list without data");
  return body.data;
}

export async function buildFeed(d: EngineDeps): Promise<Feed | null> {
  try {
    const media = (await latestMedia(d)).filter((m) => ID.test(m.id) && m.permalink && imageSource(m)).slice(0, FEED_SIZE);
    if (!media.length) throw new Error("no usable posts");

    const dir = mediaDir(d.dataDir);
    const posts: FeedPost[] = [];
    for (const m of media) {
      const files = WIDTHS.map((w) => path.join(dir, mediaName(m.id, w)));
      const cached = (await Promise.all(files.map(exists))).every(Boolean);
      if (!cached) {
        const source = await loadImage(d, imageSource(m) as string);
        for (const [i, width] of WIDTHS.entries()) {
          const webp = await sharp(source).rotate().resize(width, width, { fit: "cover" }).webp({ quality: 80 }).toBuffer();
          await writeAtomic(files[i], webp);
        }
      }
      posts.push({ id: m.id, permalink: m.permalink, mediaType: m.media_type, alt: sanitizeCaption(m.caption) });
    }

    // Drop the images of posts no longer in the latest six. Only finished images: a .tmp file may be
    // another worker's write in progress.
    const keep = new Set(posts.flatMap((p) => WIDTHS.map((w) => mediaName(p.id, w))));
    for (const name of await readdir(dir).catch(() => [] as string[])) {
      if (MEDIA_FILE.test(name) && !keep.has(name)) await unlink(path.join(dir, name)).catch(() => {});
    }

    const feed: Feed = { posts, updatedAt: new Date(d.now()).toISOString() };
    await writeAtomic(feedFile(d.dataDir), JSON.stringify(feed, null, 2));
    await writeStatus(d.dataDir, { lastFeedOk: feed.updatedAt, lastError: null, lastErrorAt: null });
    return feed;
  } catch (err) {
    const message = (err as Error).message;
    d.log(`[ig] feed unavailable: ${message}`);
    await writeStatus(d.dataDir, { lastError: message, lastErrorAt: new Date(d.now()).toISOString() });
    return readStaleFeed(d.dataDir);
  }
}
