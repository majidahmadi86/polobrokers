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
  descriptions: {
    home: "An independent specialist in original, second-hand and vintage Ralph Lauren.",
    about:
      "An independent specialist in original, second-hand and vintage Ralph Lauren. Single pieces, complete wardrobes and wholesale lots, shipping from Europe.",
    collection: "Vintage for every generation. Every piece is posted and sold on Instagram.",
    sell: "Sell your vintage items to us. We consider individual garments, complete wardrobes and wholesale collections.",
  },
  home: {
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
  aboutPage: {
    whatWeDo: "What we do",
    whatWeDoLine: "Single pieces · Complete wardrobes · Wholesale lots",
    whoWeWorkWith: "Who we work with",
    whoLine: "Private clients · Collectors · Vintage stores · Professional dealers",
    shipping: "Shipping from Europe.",
  },
  collectionPage: {
    line: "Every piece is posted and sold on Instagram.",
  },
  sellForm: {
    name: "Name",
    contact: "Phone or email",
    department: "Department",
    category: "Category",
    description: "Description, size and condition",
    choose: "Choose",
    departments: { men: "Men", women: "Women", children: "Children", mixed: "Mixed" },
    categories: [
      "Shirts and polos",
      "Knitwear",
      "Jackets and coats",
      "Trousers and shorts",
      "Dresses and skirts",
      "Accessories",
      "Complete wardrobe",
      "Wholesale lot",
      "Other",
    ],
    submit: "Continue on WhatsApp",
    note: "Your message opens in WhatsApp, ready to send. Add your photos in the chat. Nothing is stored on this site.",
    fallback: "Open WhatsApp",
    errors: {
      required: "Please fill in this field.",
      choose: "Please choose an option.",
      minLength: "Please write at least 10 characters.",
      summary: "Some fields need your attention.",
    },
    message: {
      intro: "Hello Polo Brokers, I would like to sell to you.",
      name: "Name:",
      contact: "Contact:",
      department: "Department:",
      category: "Category:",
      details: "Details:",
      outro: "I will send photos in this chat.",
    },
  },
  notFound: {
    title: "Page not found",
    back: "Back to home",
  },
};
