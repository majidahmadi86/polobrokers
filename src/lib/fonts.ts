import localFont from "next/font/local";

// Self-hosted (SIL OFL 1.1), cut from the official google/fonts variable TTFs by
// scripts/build-fonts.py: one static woff2 per weight, latin + latin-ext in the same file.
// No CDN fetch at build time (the Google Fonts CDN fails on the VPS build).
// Weights are the ones the prototype uses: Playfair Display 500 (headings, monogram, wordmark)
// and 600 (the bold header monogram), Libre Franklin 400 (text) and 600 (buttons).
export const displayFont = localFont({
  src: [
    { path: "../fonts/playfair-display-latin-ext-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/playfair-display-latin-ext-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const bodyFont = localFont({
  src: [
    { path: "../fonts/libre-franklin-latin-ext-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/libre-franklin-latin-ext-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const fontVariables = `${displayFont.variable} ${bodyFont.variable}`;
