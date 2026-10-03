import { connectConfigured, igConfig } from "@/lib/ig/config";
import { readStatus } from "@/lib/ig/engine";
import { json, notFound } from "@/lib/ig/http";
import { sameSecret } from "@/lib/ig/state";
import { daysBetween, daysUntil, readToken } from "@/lib/ig/token";

// Health in one URL: /api/ig/status?key=<IG_CONNECT_SECRET>. Wrong key: 404. Never shows the token.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const cfg = igConfig();
  const key = new URL(request.url).searchParams.get("key");
  if (!connectConfigured(cfg) || !sameSecret(key, cfg.connectSecret)) return notFound();
  const token = await readToken(cfg.dataDir);
  const status = await readStatus(cfg.dataDir);
  const now = Date.now();
  return json({
    connected: Boolean(token && Date.parse(token.expiresAt) > now),
    username: token?.username ?? null,
    tokenAgeDays: token ? daysBetween(token.obtainedAt, now) : null,
    expiresInDays: token ? daysUntil(token.expiresAt, now) : null,
    lastFeedOk: status.lastFeedOk,
    lastError: status.lastError,
    warning: status.warning,
  });
}
