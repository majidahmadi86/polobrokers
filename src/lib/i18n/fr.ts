import type { Dictionary } from "./types";

// Shell strings. Nav, buttons, menu and the disclaimer as supplied for the French site.
export const fr: Dictionary = {
  pages: {
    home: "Accueil",
    about: "À propos",
    collection: "Collection",
    sell: "Vendre",
    contact: "Contact",
    legal: "Mentions légales",
    privacy: "Confidentialité",
  },
  buttons: {
    discoverInstagram: "Découvrir sur Instagram",
    sellToUs: "Vendez-nous vos pièces",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
  },
  menu: {
    open: "Menu",
    close: "Fermer",
  },
  language: {
    label: "Langue",
    en: "English",
    fr: "Français",
  },
  a11y: {
    skipToContent: "Aller au contenu",
    mainNav: "Principale",
    footerNav: "Pied de page",
    home: "Polo Brokers, accueil",
  },
  disclaimer:
    "Revendeur indépendant de produits Ralph Lauren authentiques de seconde main. Non affilié à Ralph Lauren Corporation, ni approuvé par celle-ci.",
  // Homepage copy as supplied for the French site, separators matching EN (the prototype bullet).
  // Image alt texts translate the prototype's EN alts.
  home: {
    metaDescription: "Un spécialiste indépendant du Ralph Lauren original, de seconde main et vintage.",
    hero: {
      imageAlt: "Femme portant une chemise vintage Polo en denim lumineux",
      tagline: ["Spécialistes Ralph Lauren", "Original • Seconde main • Vintage"],
    },
    about: {
      title: ["Polo, c'est", "notre métier."],
      lead: "Un spécialiste indépendant du Ralph Lauren original, de seconde main et vintage.",
      body: "Nous sélectionnons des pièces de caractère pour hommes, femmes et enfants. D'un vêtement d'exception à des collections complètes, nous achetons, vendons et échangeons avec des particuliers, des collectionneurs et des marchands professionnels.",
    },
    selection: {
      kicker: "Notre sélection",
      title: "Le vintage pour chaque génération",
      men: "Hommes",
      women: "Femmes",
      children: "Enfants",
      menAlt: "Vêtements Ralph Lauren vintage pour homme",
      womenAlt: "Vêtements Ralph Lauren vintage pour femme",
      childrenAlt: "Vêtements Ralph Lauren vintage pour enfant",
    },
    sell: {
      imageAlt: "Marchand vintage sélectionnant des vêtements Ralph Lauren",
      kicker: "Achat • Vente • Échange",
      title: "Vendez-nous vos pièces vintage.",
      body: "Nous étudions les pièces à l'unité, les garde-robes complètes et les lots de gros. Envoyez photos, tailles et état directement sur WhatsApp.",
      features: [
        { title: "Achat", note: "Achat direct" },
        { title: "Échange", note: "Échanges sélectionnés" },
        { title: "Vente en gros", note: "Lots professionnels" },
      ],
      button: "Envoyer des photos sur WhatsApp",
    },
    follow: {
      kicker: "Nouvelles pièces • Détails • Histoires",
      title: "Suivez la collection au fil des arrivages.",
      button: "Instagram @polobrokers",
    },
  },
  notFound: {
    title: "Page introuvable",
    back: "Retour à l’accueil",
  },
};
