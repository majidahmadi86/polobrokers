/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Default .next. The gates can build a second variant side by side (NEXT_DIST_DIR=.next-mock).
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
