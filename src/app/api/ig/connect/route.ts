import { IG_AUTHORIZE_URL, IG_SCOPE, connectConfigured, igConfig } from "@/lib/ig/config";
import { notFound, redirect } from "@/lib/ig/http";
import { createState, sameSecret } from "@/lib/ig/state";

// One-time connect: /api/ig/connect?key=<IG_CONNECT_SECRET> sends the owner to Instagram's login.
// A wrong or missing key, or no Instagram configuration, is a plain 404. The state is a signed
// timestamp (no cookie).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET(request: Request) {
  const cfg = igConfig();
  const key = new URL(request.url).searchParams.get("key");
  if (!connectConfigured(cfg) || !sameSecret(key, cfg.connectSecret)) return notFound();
  const url = new URL(IG_AUTHORIZE_URL);
  url.searchParams.set("client_id", cfg.appId);
  url.searchParams.set("redirect_uri", cfg.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", IG_SCOPE);
  url.searchParams.set("state", createState(cfg.appSecret));
  return redirect(url.toString());
}
