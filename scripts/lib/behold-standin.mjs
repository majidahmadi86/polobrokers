// A local stand-in for a Behold JSON feed, for the gates only.
//   node scripts/lib/behold-standin.mjs [port]      (default 3198)
// GET /feed   tests/fixtures/behold/feed.json, every image URL pointed back at this server
// GET /img/N  a site photo standing in for that post's image (public/images)
// The site fetches these server-side only; the browser never sees this host (the privacy gate checks).
import { readFileSync } from "node:fs";
import http from "node:http";

const PORT = Number(process.argv[2] || 3198);
const BASE = `http://127.0.0.1:${PORT}`;
const PHOTOS = ["shop.jpg", "men.jpg", "women.jpg", "children.jpg", "sell.jpg"];
const feed = JSON.parse(readFileSync("tests/fixtures/behold/feed.json", "utf8"));
let n = 0;
const local = () => `${BASE}/img/${n++ % PHOTOS.length}`;
const rewrite = (post) => ({
  ...post,
  mediaUrl: local(),
  thumbnailUrl: post.thumbnailUrl ? local() : undefined,
  sizes: Object.fromEntries(Object.entries(post.sizes || {}).map(([k, s]) => [k, { ...s, mediaUrl: local() }])),
});
const body = JSON.stringify({ ...feed, posts: feed.posts.map(rewrite) });

http
  .createServer((req, res) => {
    if (req.url === "/feed") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(body);
    }
    const m = /^[/]img[/]([0-9]+)$/.exec(req.url || "");
    if (m) {
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      return res.end(readFileSync(`public/images/${PHOTOS[Number(m[1]) % PHOTOS.length]}`));
    }
    res.writeHead(404);
    res.end();
  })
  .listen(PORT, "127.0.0.1", () => console.log(`behold stand-in on ${BASE}/feed`));
