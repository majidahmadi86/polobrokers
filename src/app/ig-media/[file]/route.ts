import { readFile } from "node:fs/promises";
import path from "node:path";
import { igConfig } from "@/lib/ig/config";
import { MEDIA_FILE, mediaDir } from "@/lib/ig/engine";

// Serves the self-cached feed images, so the browser never asks an Instagram host for anything.
// Only names like 1789-640.webp are accepted: no path, no traversal, nothing else in the data folder.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const notFound = () => new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });

export async function GET(_request: Request, { params }: { params: { file: string } }) {
  const name = params.file;
  if (!MEDIA_FILE.test(name) || path.basename(name) !== name) return notFound();
  try {
    const data = await readFile(path.join(mediaDir(igConfig().dataDir), name));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return notFound();
  }
}
