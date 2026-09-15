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
export type AmenityKey =
  "pool" | "beach" | "ac" | "wifi" | "kitchen" | "parking" | "checkin" | "balcony";
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
  hero: { eyebrow: string; subtitle: string; cta: string };
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
    entrance: string;
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
  amenities: { eyebrow: string; title: string; items: Record<AmenityKey, string> };
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
      entrance: "Ingresso",
      bedroom: "Camera Matrimoniale",
      bedroomYellow: "Camera Giallo Senape",
      bathroom: "Bagno Lagunare",
      hallway: "Corridoio & Armadi",
    },
    alt: {
      "real-pool":
        "Piscina condominiale del residence con vista sulla pineta, a Cavallino Treporti",
      "real-openspace":
        "Open space con tavolo effetto marmo, cucina verde salvia e murale a pois blu sullo sfondo",
      "real-living":
        "Soggiorno con tavolo da pranzo per quattro, divano color senape e carte nautiche alle pareti",
      "real-sofa": "Divano senape con cuscini gialli, zona pranzo e portafinestra sul balcone",
      "real-kitchen":
        "Cucina con mobili verde salvia, forno e macchina del caffè, vista dal divano",
      "real-mural":
        "Parete dipinta a mano con pois blu e turchesi dietro la TV, mobile effetto marmo",
      "real-bedroom-1":
        "Camera matrimoniale con parete giallo senape, comodini con lampade e tende a righe",
      "real-bedroom-2": "Camera matrimoniale con armadio a quattro ante e aria condizionata",
      "real-bedroom-3": "Camera matrimoniale vista dal letto, con armadio e poltroncina patchwork",
      "real-bathroom-2": "Bagno con piastrelle turchesi, lavabo, sanitari, lavatrice e finestra",
      "real-bathroom-4": "Bagno con pavimento turchese, lavabo sospeso e grande specchio",
      "real-hallway": "Corridoio con ampio armadio a muro e porta verso il soggiorno",
      "real-balcony":
        "Balcone con tavolino e due sedie, affacciato sulle case colorate del residence",
      "real-entrance": "Passaggio ad arco verso l'ingresso, accanto alla parete con il murale",
      "map-area":
        "Mappa di Ca' Vio, Cavallino Treporti, con via Paolo Thaon di Revel e la spiaggia",
      "area-laguna": "Pista ciclabile tra le barene della laguna",
      "area-pineta": "Pineta affacciata sul mare vista dall'alto",
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
      eyebrow: "Ogni comfort",
      title: "Tutto quello che serve",
      items: {
        pool: "Piscina",
        beach: "Spiaggia a piedi",
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
      entrance: "Entrance",
      bedroom: "Master Bedroom",
      bedroomYellow: "Mustard Bedroom",
      bathroom: "Lagoon Bathroom",
      hallway: "Hallway & Wardrobes",
    },
    alt: {
      "real-pool": "Residence swimming pool overlooking the pine forest in Cavallino Treporti",
      "real-openspace":
        "Open-plan living area with marble-effect dining table, sage-green kitchen and blue dotted mural",
      "real-living":
        "Living room with dining table for four, mustard sofa and framed nautical charts",
      "real-sofa":
        "Mustard sofa with yellow cushions, dining area and French window to the balcony",
      "real-kitchen":
        "Kitchen with sage-green cabinets, oven and coffee machine, seen from the sofa",
      "real-mural":
        "Hand-painted wall of blue and teal dots behind the TV, with marble-effect cabinet",
      "real-bedroom-1":
        "Double bedroom with mustard-yellow wall, bedside lamps and striped curtains",
      "real-bedroom-2": "Double bedroom with four-door wardrobe and air conditioning",
      "real-bedroom-3": "Double bedroom seen from the bed, with wardrobe and patchwork armchair",
      "real-bathroom-2":
        "Bathroom with teal tiles, washbasin, toilet, bidet, washing machine and window",
      "real-bathroom-4": "Bathroom with teal floor, wall-hung washbasin and large mirror",
      "real-hallway": "Hallway with large built-in wardrobe and door to the living room",
      "real-balcony":
        "Balcony with a small table and two chairs, overlooking the colorful residence buildings",
      "real-entrance": "Arched passage to the entrance hall, next to the mural wall",
      "map-area":
        "Map of Ca' Vio, Cavallino Treporti, showing Via Paolo Thaon di Revel and the beach",
      "area-laguna": "Cycle path through the salt marshes of the lagoon",
      "area-pineta": "Aerial view of the pine forest by the sea",
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
      eyebrow: "Every comfort",
      title: "Everything you need",
      items: {
        pool: "Pool",
        beach: "Walk to the beach",
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
      entrance: "Eingang",
      bedroom: "Hauptschlafzimmer",
      bedroomYellow: "Senfgelbes Schlafzimmer",
      bathroom: "Lagunen-Badezimmer",
      hallway: "Flur & Schränke",
    },
    alt: {
      "real-pool":
        "Gemeinschaftspool der Wohnanlage mit Blick auf den Pinienwald in Cavallino Treporti",
      "real-openspace":
        "Offener Wohnbereich mit Esstisch in Marmoroptik, salbeigrüner Küche und blauem Punkte-Wandbild",
      "real-living":
        "Wohnzimmer mit Esstisch für vier Personen, senfgelbem Sofa und gerahmten Seekarten",
      "real-sofa": "Senfgelbes Sofa mit gelben Kissen, Essbereich und Balkontür",
      "real-kitchen":
        "Küche mit salbeigrünen Schränken, Backofen und Kaffeemaschine, vom Sofa aus gesehen",
      "real-mural":
        "Handbemalte Wand mit blauen und türkisen Punkten hinter dem Fernseher, Lowboard in Marmoroptik",
      "real-bedroom-1":
        "Schlafzimmer mit Doppelbett, senfgelber Wand, Nachttischlampen und gestreiften Vorhängen",
      "real-bedroom-2": "Schlafzimmer mit Doppelbett, viertürigem Kleiderschrank und Klimaanlage",
      "real-bedroom-3":
        "Schlafzimmer vom Bett aus gesehen, mit Kleiderschrank und Patchwork-Sessel",
      "real-bathroom-2":
        "Badezimmer mit türkisen Fliesen, Waschbecken, WC, Bidet, Waschmaschine und Fenster",
      "real-bathroom-4": "Badezimmer mit türkisem Boden, Hängewaschbecken und großem Spiegel",
      "real-hallway": "Flur mit großem Einbauschrank und Tür zum Wohnzimmer",
      "real-balcony":
        "Balkon mit kleinem Tisch und zwei Stühlen, Blick auf die bunten Häuser der Wohnanlage",
      "real-entrance": "Rundbogen zum Eingangsbereich neben der Wand mit dem Wandbild",
      "map-area":
        "Karte von Ca' Vio, Cavallino Treporti, mit der Via Paolo Thaon di Revel und dem Strand",
      "area-laguna": "Radweg durch die Salzwiesen der Lagune",
      "area-pineta": "Pinienwald am Meer von oben",
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
      eyebrow: "Jeder Komfort",
      title: "Alles, was Sie brauchen",
      items: {
        pool: "Pool",
        beach: "Strand zu Fuß",
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
