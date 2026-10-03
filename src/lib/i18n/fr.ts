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
  descriptions: {
    home: "Un spécialiste indépendant du Ralph Lauren original, de seconde main et vintage.",
    about:
      "Un spécialiste indépendant du Ralph Lauren original, de seconde main et vintage. Pièces uniques, garde-robes complètes et lots de gros, expédition depuis l'Europe.",
    collection: "Le vintage pour chaque génération. Chaque pièce est publiée et vendue sur Instagram.",
    sell: "Vendez-nous vos pièces vintage. Nous étudions les pièces à l'unité, les garde-robes complètes et les lots de gros.",
  },
  home: {
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
  aboutPage: {
    whatWeDo: "Ce que nous faisons",
    whatWeDoLine: "Pièces uniques · Garde-robes complètes · Lots de gros",
    whoWeWorkWith: "Avec qui nous travaillons",
    whoLine: "Particuliers · Collectionneurs · Boutiques vintage · Marchands professionnels",
    shipping: "Expédition depuis l'Europe.",
  },
  collectionPage: {
    line: "Chaque pièce est publiée et vendue sur Instagram.",
  },
  sellForm: {
    name: "Nom",
    contact: "Téléphone ou e-mail",
    department: "Rayon",
    category: "Catégorie",
    description: "Description, taille et état",
    choose: "Choisir",
    departments: { men: "Hommes", women: "Femmes", children: "Enfants", mixed: "Mixte" },
    categories: [
      "Chemises et polos",
      "Maille",
      "Vestes et manteaux",
      "Pantalons et shorts",
      "Robes et jupes",
      "Accessoires",
      "Garde-robe complète",
      "Lot de gros",
      "Autre",
    ],
    submit: "Continuer sur WhatsApp",
    note: "Votre message s'ouvre dans WhatsApp, prêt à être envoyé. Ajoutez vos photos dans la conversation. Rien n'est enregistré sur ce site.",
    fallback: "Ouvrir WhatsApp",
    errors: {
      required: "Veuillez remplir ce champ.",
      choose: "Veuillez choisir une option.",
      minLength: "Veuillez écrire au moins 10 caractères.",
      summary: "Certains champs sont à compléter.",
    },
    message: {
      intro: "Bonjour Polo Brokers, je souhaite vous vendre des pièces.",
      name: "Nom :",
      contact: "Contact :",
      department: "Rayon :",
      category: "Catégorie :",
      details: "Détails :",
      outro: "J'envoie les photos dans cette conversation.",
    },
  },
  notFound: {
    title: "Page introuvable",
    back: "Retour à l’accueil",
  },
};
