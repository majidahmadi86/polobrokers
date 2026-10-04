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
  /** Meta descriptions, each derived only from the copy on its page. */
  descriptions: Record<PageKey, string>;
  /** H1 and meta title where they differ from the short nav label. */
  docTitles: { legal: string; privacy: string };
  home: {
    hero: {
      imageAlt: string;
      tagline: [string, string];
    };
    about: {
      title: [string, string];
      lead: string;
      body: string;
    };
    selection: {
      kicker: string;
      title: string;
      men: string;
      women: string;
      children: string;
      menAlt: string;
      womenAlt: string;
      childrenAlt: string;
    };
    sell: {
      imageAlt: string;
      kicker: string;
      title: string;
      body: string;
      features: { title: string; note: string }[];
      button: string;
    };
    follow: {
      kicker: string;
      title: string;
      button: string;
    };
  };
  aboutPage: {
    whatWeDo: string;
    whatWeDoLine: string;
    whoWeWorkWith: string;
    whoLine: string;
    shipping: string;
  };
  collectionPage: {
    line: string;
  };
  sellForm: {
    name: string;
    contact: string;
    department: string;
    category: string;
    description: string;
    choose: string;
    departments: { men: string; women: string; children: string; mixed: string };
    categories: string[];
    submit: string;
    note: string;
    fallback: string;
    errors: {
      required: string;
      choose: string;
      minLength: string;
      summary: string;
    };
    /** WhatsApp message template, in the page language. Labels include their colon. */
    message: {
      intro: string;
      name: string;
      contact: string;
      department: string;
      category: string;
      details: string;
      outro: string;
    };
  };
  contactPage: {
    title: string;
    line: string;
    whatsappButton: string;
    call: string;
    instagramButton: string;
    sellPrompt: { before: string; link: string; after: string };
  };
  legalPage: {
    publisher: string;
    published: string;
    /** Labels include their colon, as typeset in each language. */
    fields: { entityName: string; entityAddress: string; registrationNumber: string; phone: string };
    contactLabel: string;
    and: string;
    hosting: string;
    design: string;
    trademarks: string;
    trademarksText: string;
    intellectualProperty: string;
    intellectualPropertyText: string;
    updated: string;
  };
  privacyPage: {
    sections: { title: string; body: string }[];
    controller: string;
    updated: string;
  };
  instagramFeed: {
    /** Alt text when a post has no usable caption. */
    fallbackAlt: string;
    /** Appended to each tile's accessible name. */
    opens: string;
  };
  notFound: {
    title: string;
    back: string;
  };
};
