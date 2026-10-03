// One shape for every language: a key missing from en.ts or fr.ts fails the type check, so the build.

export type PageKey = "home" | "about" | "collection" | "sell" | "contact" | "legal" | "privacy";

export type Dictionary = {
  pages: Record<PageKey, string>;
  buttons: {
    discoverInstagram: string;
    sellToUs: string;
    instagram: string;
    whatsapp: string;
  };
  menu: {
    open: string;
    close: string;
  };
  language: {
    label: string;
    en: string;
    fr: string;
  };
  a11y: {
    skipToContent: string;
    mainNav: string;
    footerNav: string;
    home: string;
  };
  disclaimer: string;
  notFound: {
    title: string;
    back: string;
  };
};
