import type { ImageName } from "@/lib/images";

export type Lang = "it" | "en" | "de";

// Each language has its own URL; Italian lives at the root and is also x-default.
// Keep in sync with src/routes/, ROUTES in scripts/prerender.mjs and scripts/generate-sitemap.mjs.
export const LANGS: { code: Lang; label: string; path: string; ogLocale: string }[] = [
  { code: "it", label: "Italiano", path: "/", ogLocale: "it_IT" },
  { code: "en", label: "English", path: "/en/", ogLocale: "en_GB" },
  { code: "de", label: "Deutsch", path: "/de/", ogLocale: "de_DE" },
];

export const DEFAULT_LANG: Lang = "it";

/** Language of a URL path: its first segment if that is a language code, else the default. */
export function langFromPath(pathname: string): Lang {
  const segment = pathname.split("/")[1];
  return LANGS.find((l) => l.code === segment)?.code ?? DEFAULT_LANG;
}

export type HighlightKey = "garden" | "location" | "space" | "guests";
export type AmenityKey = "ac" | "wifi" | "kitchen" | "parking" | "checkin" | "balcony";
export type HeroFactKey = "pool" | "beach" | "guests";
export type ExperienceKey = "venice" | "beach" | "active";

type Dict = {
  /** Search result title and description: written per language, like an ad. */
  meta: { title: string; description: string };
  nav: {
    gallery: string;
    about: string;
    amenities: string;
    experiences: string;
    location: string;
    book: string;
  };
  /** facts: short key points under the subtitle; icons and order in Landing.tsx. */
  hero: { eyebrow: string; subtitle: string; cta: string; facts: Record<HeroFactKey, string> };
  gallery: {
    eyebrow: string;
    title: string;
    pool: string;
    openspace: string;
    living: string;
    sofa: string;
    kitchen: string;
    mural: string;
    balcony: string;
    dining: string;
    sofabed: string;
    guestbook: string;
    view: string;
    flowers: string;
    bedroom: string;
    bedroomYellow: string;
    bathroom: string;
    hallway: string;
  };
  /** Descriptive alt text for every photo, keyed by image name. */
  alt: Record<ImageName, string>;
  features: { pine: string; pool: string; beach: string; ferry: string };
  about: {
    eyebrow: string;
    title: string;
    text: string;
    /** One line each; icons and order in Landing.tsx. */
    highlights: Record<HighlightKey, { title: string; text: string }>;
  };
  /** Short labels; icons and order in Landing.tsx. */
  amenities: { title: string; items: Record<AmenityKey, string> };
  experiences: {
    eyebrow: string;
    title: string;
    /** Photo cards; images and order in Landing.tsx. */
    cards: Record<ExperienceKey, { title: string; text: string }>;
    food: string;
  };
  contact: {
    whatsappCta: string;
    whatsappMessage: string;
    priceNote: string;
    callIt: string;
    callDe: string;
  };
  ui: {
    address: string;
    openImage: string;
    close: string;
    previous: string;
    next: string;
    /** Gallery pages: arrows and dots */
    prevPage: string;
    nextPage: string;
    page: string;
  };
  notFound: { title: string; back: string };
  location: {
    eyebrow: string;
    title: string;
    address: string;
    tagline: string;
    beach: string;
    venice: string;
    murano: string;
    openMaps: string;
  };
  footer: { tagline: string; cta: string; rights: string };
};

export const translations: Record<Lang, Dict> = {
  it: {
    meta: {
      title: "Appartamento con piscina a Cavallino Treporti, vicino a Venezia",
      description:
        "Appartamento di 62 m² per 4 persone con balcone, aria condizionata e piscina condominiale. Spiaggia a piedi e Venezia raggiungibile in ferry.",
    },
    nav: {
      gallery: "Galleria",
      about: "L'appartamento",
      amenities: "Comfort",
      experiences: "Esperienze",
      location: "Dove siamo",
      book: "Prenota",
    },
    hero: {
      eyebrow: "Appartamento con piscina · Venezia",
      subtitle: "Una fuga rilassante tra Venezia e il mare",
      cta: "Prenota Ora",
      facts: { pool: "Piscina", beach: "Spiaggia a 5 min", guests: "Fino a 4 ospiti" },
    },
    gallery: {
      eyebrow: "All'interno",
      title: "Uno sguardo intorno",
      pool: "La Piscina",
      openspace: "Open-Space",
      living: "Soggiorno",
      sofa: "Salotto & Divano",
      kitchen: "Cucina Moderna",
      mural: "Murale Lagunare",
      balcony: "Balcone",
      dining: "Zona Pranzo",
      sofabed: "Divano Letto",
      guestbook: "Libro degli Ospiti",
      view: "Vista dal Balcone",
      flowers: "Oleandri in Fiore",
      bedroom: "Camera Matrimoniale",
      bedroomYellow: "Camera Giallo Senape",
      bathroom: "Bagno Lagunare",
      hallway: "Corridoio",
    },
    alt: {
      "real-pool":
        "Piscina rotonda del residence con lettini, circondata dalla pineta, a Cavallino Treporti",
      "real-pool-3": "Piscina del residence vista dal bordo, con lettini e palazzine del complesso",
      "real-openspace":
        "Open space con tavolo apparecchiato, cucina verde salvia e murale a pois blu",
      "real-living":
        "Soggiorno con divano color senape, TV davanti al murale a pois blu e angolo cottura",
      "real-mural":
        "Divano senape con cuscini gialli e parete dipinta a pois blu e turchesi dietro la TV",
      "real-sofa":
        "Divano senape con cuscini gialli, cucina verde salvia e zona pranzo sullo sfondo",
      "real-dining": "Tavolo da pranzo per quattro accanto alla portafinestra aperta sul balcone",
      "real-kitchen": "Cucina verde salvia con forno, piano cottura e top effetto marmo",
      "real-bedroom-1":
        "Camera matrimoniale con parete giallo senape e tende a righe sulla portafinestra",
      "real-bedroom-4": "Camera matrimoniale con armadio a più ante e aria condizionata",
      "real-hallway": "Corridoio con le porte del bagno e della camera da letto",
      "real-bathroom-2":
        "Bagno con pavimento turchese, lavabo, sanitari e lavatrice, visto dalla porta",
      "real-balcony":
        "Balcone con tavolino e sedie, affacciato sul verde e sulle palazzine colorate",
      "real-view": "Vista dal balcone sulle palazzine del residence e sul giardino",
      "map-area":
        "Mappa di Ca' Vio, Cavallino Treporti, con via Paolo Thaon di Revel e la spiaggia",
      "area-laguna":
        "Laguna al tramonto a Treporti, con le briccole e la passeggiata lungo l'acqua",
      "area-liopiccolo": "Il borgo di Lio Piccolo nella laguna, con la chiesa e il campanile",
    },
    features: {
      pine: "Vista sulla pineta",
      pool: "Piscina",
      beach: "Spiaggia a piedi",
      ferry: "5 min dal ferry per Venezia",
    },
    about: {
      eyebrow: "L'appartamento",
      title: "Tra laguna, pineta e mare",
      text: "Un appartamento moderno di 62 m² in un residence tranquillo con piscina, circondato dal verde. La spiaggia è a pochi minuti a piedi e Venezia si raggiunge facilmente in traghetto.",
      highlights: {
        garden: { title: "Giardino e piscina", text: "Nel verde, con vista sulla pineta" },
        location: { title: "Zona tranquilla", text: "Spiaggia a pochi minuti, Venezia vicina" },
        space: { title: "62 m² moderni", text: "Open space luminoso e curato" },
        guests: { title: "Fino a 4 ospiti", text: "Letto matrimoniale e divano letto" },
      },
    },
    amenities: {
      title: "Tutto quello che serve",
      items: {
        ac: "Aria condizionata",
        wifi: "Wi-Fi veloce",
        kitchen: "Cucina attrezzata",
        parking: "Parcheggio privato",
        checkin: "Self check-in",
        balcony: "Balcone",
      },
    },
    experiences: {
      eyebrow: "Da vivere",
      title: "Esperienze ed escursioni",
      cards: {
        venice: {
          title: "Venezia e laguna",
          text: "In traghetto fino a Venezia, poi Murano, Burano e i tramonti in laguna.",
        },
        beach: {
          title: "Spiaggia e pineta",
          text: "Lunghe spiagge di sabbia a pochi minuti e passeggiate al tramonto.",
        },
        active: {
          title: "In bici e in kayak",
          text: "Piste ciclabili tra pineta e laguna, kayak e birdwatching.",
        },
      },
      food: "E la sera: cucina veneziana, pesce fresco e aperitivo vista laguna.",
    },
    contact: {
      whatsappCta: "WhatsApp per prenotazioni",
      priceNote: "Prezzi e disponibilità su richiesta",
      whatsappMessage: "Ciao! Vorrei informazioni per prenotare Cavallino Treporti.",
      callIt: "Italia",
      callDe: "Deutschland",
    },
    ui: {
      address: "Indirizzo",
      openImage: "apri l'immagine",
      close: "Chiudi",
      previous: "Immagine precedente",
      next: "Immagine successiva",
      prevPage: "Foto precedenti",
      nextPage: "Foto successive",
      page: "Pagina",
    },
    notFound: { title: "Pagina non trovata", back: "Torna alla home" },
    location: {
      eyebrow: "Dove trovarci",
      title: "Posizione",
      address: "Via Paolo Thaon di Revel 58", // no-break space: "58" never wraps alone
      tagline: "Cavallino Treporti, Venezia · Italia",
      beach: "→ Spiaggia",
      venice: "→ Venezia",
      murano: "→ Ferry Murano",
      openMaps: "Apri in Google Maps",
    },
    footer: {
      tagline: "Dove la laguna incontra il mare",
      cta: "Prenota Ora",
      rights: "Cavallino Treporti, Venezia",
    },
  },
  en: {
    meta: {
      title: "Apartment with Pool in Cavallino Treporti, near Venice",
      description:
        "62 m² apartment for up to 4 guests with balcony, air conditioning and shared pool. Walk to the beach and take the ferry to Venice.",
    },
    nav: {
      gallery: "Gallery",
      about: "The Apartment",
      amenities: "Amenities",
      experiences: "Experiences",
      location: "Location",
      book: "Book",
    },
    hero: {
      eyebrow: "Apartment with pool · Venice",
      subtitle: "A relaxing escape between Venice and the sea",
      cta: "Book Now",
      facts: { pool: "Pool", beach: "Beach 5 min away", guests: "Up to 4 guests" },
    },
    gallery: {
      eyebrow: "Inside",
      title: "A look around",
      pool: "The Pool",
      openspace: "Open-Space",
      living: "Living Room",
      sofa: "Sofa & Lounge",
      kitchen: "Modern Kitchen",
      mural: "Lagoon Mural",
      balcony: "Balcony",
      dining: "Dining Area",
      sofabed: "Sofa Bed",
      guestbook: "Guest Book",
      view: "Balcony View",
      flowers: "Oleanders in Bloom",
      bedroom: "Master Bedroom",
      bedroomYellow: "Mustard Bedroom",
      bathroom: "Lagoon Bathroom",
      hallway: "Hallway",
    },
    alt: {
      "real-pool":
        "Round residence pool with sun loungers, surrounded by pine forest in Cavallino Treporti",
      "real-pool-3":
        "Residence pool seen from the edge, with sun loungers and the complex buildings",
      "real-openspace":
        "Open-plan area with a laid table, sage-green kitchen and blue dotted mural",
      "real-living":
        "Living room with mustard sofa, TV in front of the blue dotted mural and kitchenette",
      "real-mural":
        "Mustard sofa with yellow cushions and hand-painted blue and teal dotted wall behind the TV",
      "real-sofa": "Mustard sofa with yellow cushions, sage-green kitchen and dining area behind",
      "real-dining": "Dining table for four next to the French window open onto the balcony",
      "real-kitchen": "Sage-green kitchen with oven, hob and marble-effect worktop",
      "real-bedroom-1":
        "Double bedroom with mustard-yellow wall and striped curtains on the French window",
      "real-bedroom-4": "Double bedroom with multi-door wardrobe and air conditioning",
      "real-hallway": "Hallway with the doors to the bathroom and the bedroom",
      "real-bathroom-2":
        "Bathroom with teal floor, washbasin, toilet and washing machine, seen from the door",
      "real-balcony":
        "Balcony with a small table and chairs, overlooking greenery and colorful buildings",
      "real-view": "View from the balcony over the residence buildings and garden",
      "map-area":
        "Map of Ca' Vio, Cavallino Treporti, showing Via Paolo Thaon di Revel and the beach",
      "area-laguna": "The lagoon at sunset in Treporti, with mooring poles and the waterside path",
      "area-liopiccolo": "The lagoon village of Lio Piccolo, with its church and bell tower",
    },
    features: {
      pine: "Pine forest views",
      pool: "Swimming pool",
      beach: "Beach walkable",
      ferry: "5 min from Venice ferry",
    },
    about: {
      eyebrow: "The apartment",
      title: "Between lagoon, pine forest and sea",
      text: "A modern 62 m² apartment in a quiet residence with a pool, surrounded by greenery. The beach is a few minutes' walk away and Venice is easy to reach by ferry.",
      highlights: {
        garden: { title: "Garden & pool", text: "Green surroundings with pine forest views" },
        location: { title: "Quiet location", text: "Beach minutes away, Venice close by" },
        space: { title: "62 m² of modern space", text: "Bright, well-designed open plan" },
        guests: { title: "Up to 4 guests", text: "Double bed and sofa bed" },
      },
    },
    amenities: {
      title: "Everything you need",
      items: {
        ac: "Air conditioning",
        wifi: "Fast Wi-Fi",
        kitchen: "Equipped kitchen",
        parking: "Private parking",
        checkin: "Self check-in",
        balcony: "Balcony",
      },
    },
    experiences: {
      eyebrow: "Things to do",
      title: "Experiences & excursions",
      cards: {
        venice: {
          title: "Venice & the lagoon",
          text: "Ferry to Venice, then Murano, Burano and sunsets on the lagoon.",
        },
        beach: {
          title: "Beach & pine forest",
          text: "Long sandy beaches minutes away and sunset walks.",
        },
        active: {
          title: "By bike and kayak",
          text: "Cycle paths through pine forest and lagoon, kayaking and birdwatching.",
        },
      },
      food: "And in the evening: Venetian cuisine, fresh seafood and an aperitivo with lagoon views.",
    },
    contact: {
      whatsappCta: "WhatsApp for bookings",
      priceNote: "Prices and availability on request",
      whatsappMessage: "Hi! I'd like some information about booking Cavallino Treporti.",
      callIt: "Italy",
      callDe: "Germany",
    },
    ui: {
      address: "Address",
      openImage: "open image",
      close: "Close",
      previous: "Previous image",
      next: "Next image",
      prevPage: "Previous photos",
      nextPage: "Next photos",
      page: "Page",
    },
    notFound: { title: "Page not found", back: "Back to the home page" },
    location: {
      eyebrow: "Where to find us",
      title: "Location",
      address: "Via Paolo Thaon di Revel 58", // no-break space: "58" never wraps alone
      tagline: "Cavallino Treporti, Venice · Italy",
      beach: "→ Beach",
      venice: "→ Venice",
      murano: "→ Murano ferry",
      openMaps: "Open in Google Maps",
    },
    footer: {
      tagline: "Where the lagoon meets the sea",
      cta: "Book Now",
      rights: "Cavallino Treporti, Venice",
    },
  },
  de: {
    meta: {
      title: "Ferienwohnung mit Pool in Cavallino Treporti bei Venedig",
      description:
        "Ferienwohnung mit 62 m² für bis zu 4 Gäste, mit Balkon, Klimaanlage und Gemeinschaftspool. Strand zu Fuß erreichbar, mit der Fähre nach Venedig.",
    },
    nav: {
      gallery: "Galerie",
      about: "Wohnung",
      amenities: "Komfort",
      experiences: "Erlebnisse",
      location: "Lage",
      book: "Buchen",
    },
    hero: {
      eyebrow: "Ferienwohnung mit Pool · Venedig",
      subtitle: "Eine erholsame Auszeit zwischen Venedig und dem Meer",
      cta: "Jetzt Buchen",
      facts: { pool: "Pool", beach: "Strand in 5 Min.", guests: "Bis zu 4 Gäste" },
    },
    gallery: {
      eyebrow: "Innenansicht",
      title: "Ein Blick ins Innere",
      pool: "Der Pool",
      openspace: "Offener Wohnraum",
      living: "Wohnzimmer",
      sofa: "Sofa & Lounge",
      kitchen: "Moderne Küche",
      mural: "Lagunen-Wandbild",
      balcony: "Balkon",
      dining: "Essbereich",
      sofabed: "Schlafsofa",
      guestbook: "Gästebuch",
      view: "Blick vom Balkon",
      flowers: "Blühender Oleander",
      bedroom: "Hauptschlafzimmer",
      bedroomYellow: "Senfgelbes Schlafzimmer",
      bathroom: "Lagunen-Badezimmer",
      hallway: "Flur",
    },
    alt: {
      "real-pool":
        "Runder Pool der Wohnanlage mit Liegen, umgeben vom Pinienwald in Cavallino Treporti",
      "real-pool-3":
        "Pool der Wohnanlage vom Beckenrand aus, mit Liegen und den Gebäuden der Anlage",
      "real-openspace":
        "Offener Wohnbereich mit gedecktem Tisch, salbeigrüner Küche und blauem Punkte-Wandbild",
      "real-living":
        "Wohnzimmer mit senfgelbem Sofa, Fernseher vor dem blauen Punkte-Wandbild und Küchenzeile",
      "real-mural":
        "Senfgelbes Sofa mit gelben Kissen und handbemalter Wand mit blauen und türkisen Punkten",
      "real-sofa":
        "Senfgelbes Sofa mit gelben Kissen, salbeigrüne Küche und Essbereich im Hintergrund",
      "real-dining": "Esstisch für vier Personen neben der offenen Balkontür",
      "real-kitchen": "Salbeigrüne Küche mit Backofen, Kochfeld und Arbeitsplatte in Marmoroptik",
      "real-bedroom-1":
        "Schlafzimmer mit Doppelbett, senfgelber Wand und gestreiften Vorhängen an der Balkontür",
      "real-bedroom-4": "Schlafzimmer mit mehrtürigem Kleiderschrank und Klimaanlage",
      "real-hallway": "Flur mit den Türen zum Badezimmer und zum Schlafzimmer",
      "real-bathroom-2":
        "Badezimmer mit türkisem Boden, Waschbecken, WC und Waschmaschine, von der Tür aus",
      "real-balcony": "Balkon mit kleinem Tisch und Stühlen, Blick ins Grüne und auf bunte Häuser",
      "real-view": "Blick vom Balkon auf die Gebäude und den Garten der Wohnanlage",
      "map-area":
        "Karte von Ca' Vio, Cavallino Treporti, mit der Via Paolo Thaon di Revel und dem Strand",
      "area-laguna": "Die Lagune bei Sonnenuntergang in Treporti, mit Pfählen und Uferweg",
      "area-liopiccolo": "Das Lagunendorf Lio Piccolo mit Kirche und Glockenturm",
    },
    features: {
      pine: "Blick auf den Pinienwald",
      pool: "Schwimmbad",
      beach: "Strand zu Fuß erreichbar",
      ferry: "5 Min. zur Fähre nach Venedig",
    },
    about: {
      eyebrow: "Die Wohnung",
      title: "Zwischen Lagune, Pinienwald und Meer",
      text: "Eine moderne 62-m²-Wohnung in einer ruhigen Anlage mit Pool, umgeben von Grün. Der Strand ist wenige Gehminuten entfernt, Venedig erreichen Sie bequem mit der Fähre.",
      highlights: {
        garden: { title: "Garten & Pool", text: "Im Grünen, mit Blick auf den Pinienwald" },
        location: { title: "Ruhige Lage", text: "Strand in wenigen Minuten, Venedig ganz nah" },
        space: { title: "62 m² modern", text: "Helles, durchdachtes Open Space" },
        guests: { title: "Bis zu 4 Gäste", text: "Doppelbett und Schlafsofa" },
      },
    },
    amenities: {
      title: "Alles, was Sie brauchen",
      items: {
        ac: "Klimaanlage",
        wifi: "Schnelles WLAN",
        kitchen: "Ausgestattete Küche",
        parking: "Privatparkplatz",
        checkin: "Self-Check-in",
        balcony: "Balkon",
      },
    },
    experiences: {
      eyebrow: "Erleben",
      title: "Erlebnisse & Ausflüge",
      cards: {
        venice: {
          title: "Venedig & Lagune",
          text: "Mit der Fähre nach Venedig, dann Murano, Burano und Sonnenuntergänge in der Lagune.",
        },
        beach: {
          title: "Strand & Pinienwald",
          text: "Lange Sandstrände wenige Minuten entfernt und Spaziergänge bei Sonnenuntergang.",
        },
        active: {
          title: "Mit Rad und Kajak",
          text: "Radwege durch Pinienwald und Lagune, Kajakfahren und Vogelbeobachtung.",
        },
      },
      food: "Und am Abend: venezianische Küche, frischer Fisch und ein Aperitivo mit Blick auf die Lagune.",
    },
    contact: {
      whatsappCta: "WhatsApp für Buchungen",
      priceNote: "Preise und Verfügbarkeit auf Anfrage",
      whatsappMessage: "Hallo! Ich hätte gerne Informationen zur Buchung von Cavallino Treporti.",
      callIt: "Italien",
      callDe: "Deutschland",
    },
    ui: {
      address: "Adresse",
      openImage: "Bild öffnen",
      close: "Schließen",
      previous: "Vorheriges Bild",
      next: "Nächstes Bild",
      prevPage: "Vorherige Fotos",
      nextPage: "Nächste Fotos",
      page: "Seite",
    },
    notFound: { title: "Seite nicht gefunden", back: "Zur Startseite" },
    location: {
      eyebrow: "So finden Sie uns",
      title: "Lage",
      address: "Via Paolo Thaon di Revel 58", // no-break space: "58" never wraps alone
      tagline: "Cavallino Treporti, Venedig · Italien",
      beach: "→ Strand",
      venice: "→ Venedig",
      murano: "→ Murano-Fähre",
      openMaps: "In Google Maps öffnen",
    },
    footer: {
      tagline: "Wo die Lagune auf das Meer trifft",
      cta: "Jetzt Buchen",
      rights: "Cavallino Treporti, Venedig",
    },
  },
};
