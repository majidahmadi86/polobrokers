import { revalidatePath, revalidateTag } from "next/cache";
import { IG_API_VERSION, connectConfigured, igConfig } from "@/lib/ig/config";
import { FEED_PATHS, FEED_TAG } from "@/lib/ig/feed";
import { notFound, page } from "@/lib/ig/http";
import { verifyState } from "@/lib/ig/state";
import { writeToken } from "@/lib/ig/token";

// Instagram sends the owner back here with ?code&state. The code becomes a short-lived token, then
// a 60-day token. Only the @polobrokers account is accepted; anything else stores nothing.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REFUSED = ["Instagram could not be connected. Please try the link again.", "Instagram n'a pas pu être connecté. Veuillez réessayer le lien."] as const;

async function call(url: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const res = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).pathname}`);
  return (await res.json()) as Record<string, unknown>;
}

export async function GET(request: Request) {
  const cfg = igConfig();
  if (!connectConfigured(cfg)) return notFound();
  const params = new URL(request.url).searchParams;
  const code = params.get("code");
  if (!code || !verifyState(params.get("state"), cfg.appSecret)) {
    console.warn("[ig] connect refused: missing code or invalid state");
    return page(400, ...REFUSED);
  }

  try {
    // 1. Code to short-lived token. The answer is either flat or wrapped in data[0].
    const short = await call(`${cfg.oauthBase}/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: cfg.appId,
        client_secret: cfg.appSecret,
        grant_type: "authorization_code",
        redirect_uri: cfg.redirectUri,
        code,
      }),
    });
    const first = (Array.isArray(short.data) ? short.data[0] : short) as { access_token?: string };
    if (!first?.access_token) throw new Error("no short-lived token");

    // 2. Short-lived to long-lived (60 days).
    const long = await call(
      `${cfg.graphBase}/access_token?grant_type=ig_exchange_token&client_secret=${encodeURIComponent(cfg.appSecret)}&access_token=${encodeURIComponent(first.access_token)}`,
    );
    const token = long.access_token as string | undefined;
    const expiresIn = Number(long.expires_in);
    if (!token || !expiresIn) throw new Error("no long-lived token");

    // 3. Whose account is it? Only @polobrokers.
    const me = await call(`${cfg.graphBase}/${IG_API_VERSION}/me?fields=user_id,username&access_token=${encodeURIComponent(token)}`);
    const username = String(me.username || "");
    if (username.toLowerCase() !== cfg.expectedUsername) {
      console.warn(`[ig] connect refused: account @${username || "unknown"} is not @${cfg.expectedUsername}`);
      return page(403, ...REFUSED);
    }

    const now = Date.now();
    await writeToken(cfg.dataDir, {
      token,
      userId: String(me.user_id || me.id || ""),
      username,
      obtainedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + expiresIn * 1000).toISOString(),
    });
    console.warn(`[ig] connected @${username}, token valid ${Math.round(expiresIn / 86400)} days`);
    revalidateTag(FEED_TAG);
    for (const path of FEED_PATHS) revalidatePath(path);
    return page(200, "Instagram connected. You can close this page.", "Instagram est connecté. Vous pouvez fermer cette page.");
  } catch (err) {
    console.warn(`[ig] connect failed: ${(err as Error).message}`);
    return page(502, ...REFUSED);
  }
}
