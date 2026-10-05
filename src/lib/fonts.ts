import localFont from "next/font/local";

// Self-hosted (SIL OFL 1.1), cut from the official google/fonts variable TTFs by
// scripts/build-fonts.py: one static woff2 per weight, Google latin range (every French accent, oe).
// No CDN fetch at build time (the Google Fonts CDN fails on the VPS build).
// Weights in use: Playfair Display 500 (headings), Libre Franklin 400 (text) and 600 (buttons).
export const displayFont = localFont({
  src: [
    { path: "../fonts/playfair-display-latin-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const bodyFont = localFont({
  src: [
    { path: "../fonts/libre-franklin-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/libre-franklin-latin-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const fontVariables = `${displayFont.variable} ${bodyFont.variable}`;
