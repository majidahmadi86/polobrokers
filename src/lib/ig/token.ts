import "server-only";
import { chmod, mkdir, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// The long-lived token, stored in IG_DATA_DIR/token.json (mode 600, written atomically).
// Refresh policy: the API refuses a refresh before the token is 24 hours old; we refresh once it is
// 7 days old, well inside its 60 days.

export type StoredToken = {
  token: string;
  userId: string;
  username: string;
  /** ISO time this token string was obtained (connect or last refresh). */
  obtainedAt: string;
  /** ISO time it expires. */
  expiresAt: string;
};

const DAY = 24 * 60 * 60 * 1000;
export const MIN_REFRESH_AGE_MS = DAY;
export const REFRESH_AFTER_MS = 7 * DAY;
export const EXPIRY_WARNING_DAYS = 10;

export function shouldRefresh(token: Pick<StoredToken, "obtainedAt">, now = Date.now()): boolean {
  const age = now - Date.parse(token.obtainedAt);
  return age >= Math.max(MIN_REFRESH_AGE_MS, REFRESH_AFTER_MS);
}

export function daysBetween(fromIso: string, now = Date.now()): number {
  return Math.floor((now - Date.parse(fromIso)) / DAY);
}

export function daysUntil(toIso: string, now = Date.now()): number {
  return Math.floor((Date.parse(toIso) - now) / DAY);
}

/**
 * Writes a file atomically: a temp file in the same folder, then a rename. Mode applies to both.
 * Several build workers can write the same file at once (each page renders the feed); on Windows a
 * rename onto a file another process is replacing fails, so it is retried, and if the target is
 * there by then, the other writer won and the result is the same.
 */
export async function writeAtomic(file: string, data: string | Buffer, mode = 0o644): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
  await writeFile(tmp, data, { mode });
  for (let attempt = 0; ; attempt++) {
    try {
      await rename(tmp, file);
      break;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if ((code === "EPERM" || code === "EACCES" || code === "EBUSY") && attempt < 5) {
        await new Promise((r) => setTimeout(r, 40 * (attempt + 1)));
        continue;
      }
      await unlink(tmp).catch(() => {});
      if (await stat(file).then(() => true, () => false)) return;
      throw err;
    }
  }
  await chmod(file, mode).catch(() => {});
}

export const tokenFile = (dataDir: string) => path.join(dataDir, "token.json");

export async function readToken(dataDir: string): Promise<StoredToken | null> {
  try {
    const parsed = JSON.parse(await readFile(tokenFile(dataDir), "utf8")) as StoredToken;
    return parsed.token && parsed.expiresAt && parsed.obtainedAt ? parsed : null;
  } catch {
    return null;
  }
}

export async function writeToken(dataDir: string, token: StoredToken): Promise<void> {
  await writeAtomic(tokenFile(dataDir), JSON.stringify(token, null, 2), 0o600);
}
