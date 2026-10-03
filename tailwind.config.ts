import type { Config } from "tailwindcss";

// Tokens from the prototype stylesheet (docs/prototype/TOKENS.md). The CSS variables live in
// src/app/globals.css; Tailwind reads them so a value changes in one place.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: "rgb(var(--green) / <alpha-value>)",
        ivory: "rgb(var(--ivory) / <alpha-value>)",
        warm: "rgb(var(--warm) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        rule: "rgb(var(--rule) / <alpha-value>)",
        "panel-border": "rgb(var(--panel-border) / <alpha-value>)",
        "gold-pale": "rgb(var(--gold-pale) / <alpha-value>)",
        "gold-text": "rgb(var(--gold-text) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        "footer-bg": "rgb(var(--footer-bg) / <alpha-value>)",
        "footer-text": "rgb(var(--footer-text) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"],
      },
      fontSize: {
        // Small caps label system: nav, kicker, sub line, buttons, footer.
        label: ".7rem",
        kicker: ".67rem",
        sub: ".64rem",
        btn: ".69rem",
        footer: ".65rem",
        brand: "1.3rem",
      },
      letterSpacing: {
        brand: ".08em",
        label: ".14em",
        sub: ".19em",
        btn: ".11em",
        kicker: ".22em",
        name: ".06em",
      },
      screens: {
        // Below 1024px the full nav no longer fits cleanly next to the wordmark: mobile menu.
        nav: "1024px",
      },
    },
  },
  plugins: [],
};
export default config;
