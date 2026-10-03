import type { Dictionary } from "./types";

// Shell strings. Nav, buttons and the disclaimer are verbatim from the prototype.
export const en: Dictionary = {
  pages: {
    home: "Home",
    about: "About",
    collection: "Collection",
    sell: "Sell",
    contact: "Contact",
    legal: "Legal",
    privacy: "Privacy",
  },
  buttons: {
    discoverInstagram: "Discover on Instagram",
    sellToUs: "Sell to us",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
  },
  menu: {
    open: "Menu",
    close: "Close",
  },
  language: {
    label: "Language",
    en: "English",
    fr: "Français",
  },
  a11y: {
    skipToContent: "Skip to content",
    mainNav: "Main",
    footerNav: "Footer",
    home: "Polo Brokers, home",
  },
  disclaimer:
    "Independent reseller of authentic pre-owned Ralph Lauren products. Not affiliated with or endorsed by Ralph Lauren Corporation.",
  // Homepage copy verbatim from docs/prototype/COPY.md (separators are the prototype's bullet).
  home: {
    metaDescription: "An independent specialist in original, second-hand and vintage Ralph Lauren.",
    hero: {
      imageAlt: "Woman wearing a luminous vintage Polo denim shirt",
      tagline: ["Ralph Lauren specialists", "Original • Second-hand • Vintage"],
    },
    about: {
      title: ["Polo is", "our business."],
      lead: "An independent specialist in original, second-hand and vintage Ralph Lauren.",
      body: "We source pieces with character for men, women and children. From one special garment to complete collections, we buy, sell and trade with private clients, collectors and professional dealers.",
    },
    selection: {
      kicker: "Our selection",
      title: "Vintage for every generation",
      men: "Men",
      women: "Women",
      children: "Children",
      menAlt: "Vintage Ralph Lauren menswear",
      womenAlt: "Vintage Ralph Lauren womenswear",
      childrenAlt: "Vintage Ralph Lauren childrenswear",
    },
    sell: {
      imageAlt: "Vintage dealer selecting Ralph Lauren garments",
      kicker: "Buy • Sell • Trade",
      title: "Sell your vintage items to us.",
      body: "We consider individual garments, complete wardrobes and wholesale collections. Send photographs, sizes and condition details directly through WhatsApp.",
      features: [
        { title: "Buy", note: "Direct purchase" },
        { title: "Trade", note: "Selected exchanges" },
        { title: "Wholesale", note: "Professional lots" },
      ],
      button: "Send photos on WhatsApp",
    },
    follow: {
      kicker: "New pieces • Details • Stories",
      title: "Follow the collection as it arrives.",
      button: "Instagram @polobrokers",
    },
  },
  notFound: {
    title: "Page not found",
    back: "Back to home",
  },
};
