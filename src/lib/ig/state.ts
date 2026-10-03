import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// OAuth state without a cookie: a timestamp signed with the app secret (HMAC-SHA256), valid 15
// minutes. The callback only accepts a state this server signed recently.

export const STATE_TTL_MS = 15 * 60 * 1000;
const SKEW_MS = 60 * 1000;

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function createState(secret: string, now = Date.now()): string {
  const payload = String(now);
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyState(state: string | null | undefined, secret: string, now = Date.now()): boolean {
  if (!state) return false;
  const [payload, signature, extra] = state.split(".");
  if (!payload || !signature || extra !== undefined || !/^[0-9]+$/.test(payload)) return false;
  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  const issued = Number(payload);
  return issued <= now + SKEW_MS && now - issued <= STATE_TTL_MS;
}

/** Constant-time comparison for the connect key. */
export function sameSecret(given: string | null | undefined, expected: string): boolean {
  if (!given || !expected) return false;
  const a = createHmac("sha256", "key").update(given).digest();
  const b = createHmac("sha256", "key").update(expected).digest();
  return timingSafeEqual(a, b);
}
