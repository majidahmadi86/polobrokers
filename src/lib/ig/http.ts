import "server-only";

// Responses for the private Instagram routes: never indexed, never cached.
const PRIVATE = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };

export const notFound = () => new Response("Not found", { status: 404, headers: { ...PRIVATE, "Content-Type": "text/plain" } });

export const json = (body: unknown) => Response.json(body, { headers: PRIVATE });

export const redirect = (url: string) => new Response(null, { status: 302, headers: { ...PRIVATE, Location: url } });

/** A minimal branded page, EN and FR together (the owner may read either). Inline styles only. */
export function page(status: number, en: string, fr: string): Response {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Polo Brokers</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b2e24;color:#f7f1e4;font:16px/1.6 Georgia,"Times New Roman",serif;padding:24px;box-sizing:border-box}main{max-width:520px;text-align:center}b{display:inline-grid;place-items:center;width:64px;height:64px;border:1px solid #f7f1e4;font-size:30px;font-weight:600;margin-bottom:28px}p{font-size:1.35rem;margin:0 0 12px}p[lang=fr]{opacity:.85}</style></head>
<body><main><b aria-hidden="true">PB</b><p>${en}</p><p lang="fr">${fr}</p></main></body></html>`;
  return new Response(html, { status, headers: { ...PRIVATE, "Content-Type": "text/html; charset=utf-8" } });
}
