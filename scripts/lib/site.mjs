// Shared by the gates: the 14 routes and the server they run against.
export const BASE_URL = (process.env.BASE_URL || "http://localhost:3112").replace(/\/$/, "");

const SLUGS = ["", "about", "collection", "sell", "contact", "legal", "privacy"];
export const ROUTES = [
  ...SLUGS.map((slug) => ({ path: slug ? `/${slug}` : "/", lang: "en" })),
  ...SLUGS.map((slug) => ({ path: slug ? `/fr/${slug}` : "/fr", lang: "fr" })),
];

export const langOf = (path) => (path === "/fr" || path.startsWith("/fr/") ? "fr" : "en");
