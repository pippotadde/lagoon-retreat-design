import type { ImageName } from "@/lib/images";

export type Lang = "it" | "en" | "de";

// Each language has its own URL; Italian lives at the root and is also x-default.
// Keep in sync with src/routes/, ROUTES in scripts/prerender.mjs and scripts/generate-sitemap.mjs.
export const LANGS: { code: Lang; label: string; flag: string; path: string; ogLocale: string }[] =
  [
    { code: "it", label: "Italiano", flag: "🇮🇹", path: "/", ogLocale: "it_IT" },
    { code: "en", label: "English", flag: "🇬🇧", path: "/en/", ogLocale: "en_GB" },
    { code: "de", label: "Deutsch", flag: "🇩🇪", path: "/de/", ogLocale: "de_DE" },
  ];

export const DEFAULT_LANG: Lang = "it";

/** Language of a URL path: its first segment if that is a language code, else the default. */
export function langFromPath(pathname: string): Lang {
  const segment = pathname.split("/")[1];
  return LANGS.find((l) => l.code === segment)?.code ?? DEFAULT_LANG;
}

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
    p1: string;
    p2a: string;
    mural: string;
    p2b: string;
    marble: string;
    p2c: string;
    yellow: string;
    p2d: string;
    teal: string;
    p2e: string;
    sqm: string;
    guests: string;
    bedroom: string;
    balcony: string;
  };
  amenities: { eyebrow: string; title: string; items: string[] };
  experiences: {
    eyebrow: string;
    title: string;
    narrative: ({ type: "text"; value: string } | { type: "link"; value: string; query: string })[];
  };
  contact: {
    whatsappCta: string;
    whatsappMessage: string;
    priceNote: string;
    callIt: string;
    callDe: string;
  };
  ui: { address: string; openImage: string; close: string; previous: string; next: string };
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
    showMap: string;
    mapNotice: string;
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
      eyebrow: "Cavallino Treporti · Venezia",
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
    },
    features: {
      pine: "Vista sulla pineta",
      pool: "Piscina",
      beach: "Spiaggia a piedi",
      ferry: "5 min dal ferry per Venezia",
    },
    about: {
      eyebrow: "L'appartamento",
      title: "Luminoso, colorato e ispirato alla laguna",
      p1: "Un moderno open-space di 62 mq che ospita fino a 4 persone, progettato con una palette giocosa presa in prestito direttamente dalla laguna veneziana e dalla calda luce dell'Adriatico.",
      p2a: "Il soggiorno è caratterizzato da un ",
      mural: "murale ad acquerello con bolle teal",
      p2b: " — gocce blu che danzano sull'intonaco bianco, la nostra firma visiva. La cucina sfoggia ",
      marble: "piani in effetto marmo",
      p2c: " abbinati a mobili color salvia, mentre la camera da letto è avvolta da una ",
      yellow: "parete giallo senape",
      p2d: ". Il bagno brilla con ",
      teal: "piastrelle teal lagunari",
      p2e: " — un promemoria quotidiano che il mare è proprio fuori.",
      sqm: "62 mq",
      guests: "Fino a 4 ospiti",
      bedroom: "1 camera da letto",
      balcony: "Balcone privato",
    },
    amenities: {
      eyebrow: "Ogni comfort",
      title: "Comfort essenziali",
      items: [
        "Piscina condominiale",
        "Vista sulla pineta",
        "Spiaggia a piedi",
        "Aria condizionata",
        "Cucina completa",
        "Macchina da caffè",
        "Wi-Fi veloce",
        "Smart TV",
        "Lavatrice",
        "Parcheggio privato",
        "Self check-in",
        "Balcone privato",
      ],
    },
    experiences: {
      eyebrow: "Oltre il rifugio",
      title: "Esperienze ed Escursioni",
      narrative: [
        { type: "text", value: "A pochi passi dall'appartamento puoi raggiungere " },
        { type: "link", value: "Venezia e la Laguna", query: "Piazza+San+Marco,+Venezia" },
        { type: "text", value: " in ferry, rilassarti sulla " },
        {
          type: "link",
          value: "Spiaggia e nella pineta",
          query: "Spiaggia+Cavallino+Treporti,+Venezia",
        },
        { type: "text", value: ", praticare " },
        {
          type: "link",
          value: "Attività all'aperto",
          query: "Oasi+Naturalistica+Cavallino+Treporti",
        },
        { type: "text", value: " in bici o kayak, oppure scoprire il " },
        { type: "link", value: "Cibo e il vino", query: "Restaurants+Cavallino+Treporti,+Venezia" },
        { type: "text", value: " del territorio." },
      ],
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
    },
    notFound: { title: "Pagina non trovata", back: "Torna alla home" },
    location: {
      eyebrow: "Dove trovarci",
      title: "Posizione",
      address: "Via Paolo Thaon di Revel 58",
      tagline: "Cavallino Treporti, Venezia · Italia",
      beach: "→ Spiaggia",
      venice: "→ Venezia",
      murano: "→ Ferry Murano",
      openMaps: "Apri in Google Maps",
      showMap: "Mostra la mappa",
      mapNotice: "La mappa interattiva viene caricata da Google",
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
      eyebrow: "Cavallino Treporti · Venice",
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
    },
    features: {
      pine: "Pine forest views",
      pool: "Swimming pool",
      beach: "Beach walkable",
      ferry: "5 min from Venice ferry",
    },
    about: {
      eyebrow: "The apartment",
      title: "Bright, colorful & inspired by the lagoon",
      p1: "A 62 sqm modern open-space retreat hosting up to 4 guests, designed with a playful palette borrowed straight from the Venetian lagoon and the warm Adriatic light.",
      p2a: "The living room features a hand-painted ",
      mural: "watercolor bubble-dot wall",
      p2b: " — teal droplets dancing across white plaster, our signature visual identity. The kitchen wears ",
      marble: "marble-effect countertops",
      p2c: " paired with sage cabinetry, while the bedroom is wrapped in a ",
      yellow: "warm mustard accent wall",
      p2d: ". The bathroom glows with ",
      teal: "teal lagoon floor tiles",
      p2e: " — a daily reminder that the sea is just outside.",
      sqm: "62 sqm",
      guests: "Up to 4 guests",
      bedroom: "1 bedroom",
      balcony: "Private balcony",
    },
    amenities: {
      eyebrow: "Every comfort",
      title: "Essential comforts",
      items: [
        "Shared swimming pool",
        "Pine forest views",
        "Beach walkable",
        "Air conditioning",
        "Full kitchen",
        "Coffee machine",
        "Fast Wi-Fi",
        "Smart TV",
        "Washing machine",
        "Private parking",
        "Self check-in",
        "Private balcony",
      ],
    },
    experiences: {
      eyebrow: "Beyond the retreat",
      title: "Experiences & Excursions",
      narrative: [
        { type: "text", value: "Just steps from the apartment you can reach " },
        { type: "link", value: "Venice and the Lagoon", query: "Piazza+San+Marco,+Venezia" },
        { type: "text", value: " by ferry, unwind on the " },
        {
          type: "link",
          value: "Beach and in the pine forest",
          query: "Spiaggia+Cavallino+Treporti,+Venezia",
        },
        { type: "text", value: ", enjoy " },
        {
          type: "link",
          value: "Outdoor activities",
          query: "Oasi+Naturalistica+Cavallino+Treporti",
        },
        { type: "text", value: " by bike or kayak, or discover the local " },
        { type: "link", value: "Food and wine", query: "Restaurants+Cavallino+Treporti,+Venezia" },
        { type: "text", value: " of the area." },
      ],
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
    },
    notFound: { title: "Page not found", back: "Back to the home page" },
    location: {
      eyebrow: "Where to find us",
      title: "Location",
      address: "Via Paolo Thaon di Revel 58",
      tagline: "Cavallino Treporti, Venice · Italy",
      beach: "→ Beach",
      venice: "→ Venice",
      murano: "→ Murano ferry",
      openMaps: "Open in Google Maps",
      showMap: "Show the map",
      mapNotice: "The interactive map is loaded from Google",
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
      eyebrow: "Cavallino Treporti · Venedig",
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
    },
    features: {
      pine: "Blick auf den Pinienwald",
      pool: "Schwimmbad",
      beach: "Strand zu Fuß erreichbar",
      ferry: "5 Min. zur Fähre nach Venedig",
    },
    about: {
      eyebrow: "Die Wohnung",
      title: "Hell, farbenfroh & von der Lagune inspiriert",
      p1: "Ein moderner offener Wohnraum von 62 qm für bis zu 4 Gäste, gestaltet mit einer verspielten Farbpalette, die direkt von der venezianischen Lagune und dem warmen Adrialicht inspiriert ist.",
      p2a: "Das Wohnzimmer zeichnet sich durch eine ",
      mural: "handgemalte Aquarell-Punktwand",
      p2b: " aus — türkisfarbene Tropfen tanzen über weißen Putz, unsere unverwechselbare Note. Die Küche trägt ",
      marble: "Arbeitsplatten in Marmoroptik",
      p2c: " kombiniert mit salbeigrünen Schränken, während das Schlafzimmer in eine ",
      yellow: "warme senfgelbe Akzentwand",
      p2d: " gehüllt ist. Das Bad strahlt mit ",
      teal: "türkisen Lagunenfliesen",
      p2e: " — eine tägliche Erinnerung daran, dass das Meer direkt vor der Tür liegt.",
      sqm: "62 qm",
      guests: "Bis zu 4 Gäste",
      bedroom: "1 Schlafzimmer",
      balcony: "Privater Balkon",
    },
    amenities: {
      eyebrow: "Jeder Komfort",
      title: "Wesentliche Annehmlichkeiten",
      items: [
        "Gemeinschaftspool",
        "Blick auf den Pinienwald",
        "Strand zu Fuß",
        "Klimaanlage",
        "Voll ausgestattete Küche",
        "Kaffeemaschine",
        "Schnelles WLAN",
        "Smart TV",
        "Waschmaschine",
        "Privatparkplatz",
        "Self Check-in",
        "Privater Balkon",
      ],
    },
    experiences: {
      eyebrow: "Jenseits der Wohnung",
      title: "Erlebnisse & Ausflüge",
      narrative: [
        { type: "text", value: "Nur wenige Schritte von der Wohnung entfernt können Sie " },
        { type: "link", value: "Venedig und die Lagune", query: "Piazza+San+Marco,+Venezia" },
        { type: "text", value: " mit der Fähre erreichen, sich am " },
        {
          type: "link",
          value: "Strand und im Pinienwald",
          query: "Spiaggia+Cavallino+Treporti,+Venezia",
        },
        { type: "text", value: " entspannen, " },
        {
          type: "link",
          value: "Outdoor-Aktivitäten",
          query: "Oasi+Naturalistica+Cavallino+Treporti",
        },
        { type: "text", value: " mit dem Fahrrad oder Kajak ausüben oder die lokale " },
        {
          type: "link",
          value: "Küche und Weine",
          query: "Restaurants+Cavallino+Treporti,+Venezia",
        },
        { type: "text", value: " entdecken." },
      ],
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
    },
    notFound: { title: "Seite nicht gefunden", back: "Zur Startseite" },
    location: {
      eyebrow: "So finden Sie uns",
      title: "Lage",
      address: "Via Paolo Thaon di Revel 58",
      tagline: "Cavallino Treporti, Venedig · Italien",
      beach: "→ Strand",
      venice: "→ Venedig",
      murano: "→ Murano-Fähre",
      openMaps: "In Google Maps öffnen",
      showMap: "Karte anzeigen",
      mapNotice: "Die interaktive Karte wird von Google geladen",
    },
    footer: {
      tagline: "Wo die Lagune auf das Meer trifft",
      cta: "Jetzt Buchen",
      rights: "Cavallino Treporti, Venedig",
    },
  },
};
