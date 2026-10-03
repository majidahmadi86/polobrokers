import "server-only";
import path from "node:path";

// Instagram API with Instagram Login, configuration from the environment (see .env.example).
// Endpoints checked against Meta's docs in October 2026 (Graph API v25.0):
//   authorize      https://www.instagram.com/oauth/authorize            scope instagram_business_basic
//   code exchange  POST https://api.instagram.com/oauth/access_token    short-lived token (1 hour)
//   long-lived     GET  https://graph.instagram.com/access_token        grant_type=ig_exchange_token, 60 days
//   refresh        GET  https://graph.instagram.com/refresh_access_token grant_type=ig_refresh_token, token >= 24h old
//   profile        GET  https://graph.instagram.com/v25.0/me?fields=user_id,username
//   media          GET  https://graph.instagram.com/v25.0/<IG_ID>/media?fields=...

export const IG_API_VERSION = "v25.0";
export const IG_SCOPE = "instagram_business_basic";
export const IG_AUTHORIZE_URL = "https://www.instagram.com/oauth/authorize";

export type IgConfig = {
  appId: string;
  appSecret: string;
  redirectUri: string;
  connectSecret: string;
  dataDir: string;
  mock: boolean;
  /** Only this account may connect. */
  expectedUsername: string;
  graphBase: string;
  oauthBase: string;
  fixturesDir: string;
};

export function igConfig(): IgConfig {
  const env = process.env;
  return {
    appId: env.IG_APP_ID || "",
    appSecret: env.IG_APP_SECRET || "",
    redirectUri: env.IG_REDIRECT_URI || "",
    connectSecret: env.IG_CONNECT_SECRET || "",
    dataDir: path.resolve(env.IG_DATA_DIR || "./.data"),
    mock: env.IG_MOCK === "1",
    expectedUsername: "polobrokers",
    // Test-only overrides, so the gates can stand in for Instagram with a local HTTP server.
    graphBase: env.IG_GRAPH_BASE || "https://graph.instagram.com",
    oauthBase: env.IG_OAUTH_BASE || "https://api.instagram.com",
    fixturesDir: path.resolve("tests/fixtures/ig"),
  };
}

/** The connect and status routes exist only when every value they need is set. */
export function connectConfigured(cfg: IgConfig): boolean {
  return Boolean(cfg.appId && cfg.appSecret && cfg.redirectUri && cfg.connectSecret);
}
