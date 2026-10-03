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
    contact: "Write to us on WhatsApp or send a message on Instagram.",
    legal: "This website is published by Polo Brokers. Ralph Lauren and Polo are trademarks of Ralph Lauren Corporation.",
    privacy: "This website uses no cookies, no analytics and no advertising trackers, and has no user accounts.",
  },
  docTitles: {
    legal: "Legal notice",
    privacy: "Privacy policy",
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
  contactPage: {
    title: "Get in touch.",
    line: "Write to us on WhatsApp or send a message on Instagram.",
    whatsappButton: "Message us",
    instagramButton: "Open Instagram",
    sellPrompt: { before: "Selling pieces? Use our ", link: "sell form", after: "." },
  },
  legalPage: {
    publisher: "Publisher",
    published: "This website is published by Polo Brokers.",
    fields: {
      entityName: "Company:",
      entityAddress: "Address:",
      registrationNumber: "Registration number:",
      publicationDirector: "Publication director:",
    },
    contactLabel: "Contact:",
    and: "and",
    hosting: "Hosting",
    design: "Design and development",
    trademarks: "Trademarks",
    trademarksText:
      "Ralph Lauren and Polo are trademarks of Ralph Lauren Corporation. Polo Brokers is an independent reseller of authentic pre-owned Ralph Lauren products and is not affiliated with or endorsed by Ralph Lauren Corporation. Brand names are used only to describe the products we resell.",
    intellectualProperty: "Intellectual property",
    intellectualPropertyText:
      "The content of this website, including its text, images, name and monogram, may not be reproduced without permission.",
    updated: "Last updated:",
  },
  privacyPage: {
    sections: [
      {
        title: "Overview",
        body: "This website uses no cookies, no analytics and no advertising trackers, and has no user accounts. Fonts and images are served from this website itself.",
      },
      {
        title: "The sell form",
        body: "The sell form sends and stores nothing on this website. When you press Continue on WhatsApp, your browser opens WhatsApp with your message prefilled. Nothing is sent until you send it yourself.",
      },
      {
        title: "WhatsApp and Instagram",
        body: "Messages you send us on WhatsApp or Instagram are handled by those services, operated by Meta, under their own privacy policies. We use the details you send us only to answer your request and to complete any purchase, sale or trade we agree on.",
      },
      {
        title: "Server logs",
        body: "Like any website, our hosting server records technical data such as IP address, browser type and the page requested, for security and to keep the site running.",
      },
      {
        title: "Your rights",
        body: "Under the GDPR, you may ask to access, correct or delete personal data we hold about you, or object to its use. Contact us on WhatsApp or Instagram. You may also lodge a complaint with your data protection authority.",
      },
    ],
    controller: "Data controller:",
    updated: "Last updated:",
  },
  notFound: {
    title: "Page not found",
    back: "Back to home",
  },
};
