import { useCallback, useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { LangProvider, useLang } from "@/hooks/use-lang";
import { Icon, type IconName } from "@/components/Icons";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { Picture } from "@/components/Picture";
import { isLandscape, type ImageName } from "@/lib/images";
import {
  LANGS,
  type AmenityKey,
  type ExperienceKey,
  type HeroFactKey,
  type HighlightKey,
  type Lang,
} from "@/lib/i18n";
import { CIN, PHONE_DE_DISPLAY, PHONE_IT_DISPLAY } from "@/lib/contact";
import { WhatsAppButton, WhatsAppFloatingButton } from "@/components/WhatsApp";

// `sizes` for each image slot: its rendered width. With object-cover a landscape (4:3)
// photo in a taller box is wider than the box (box height × 4/3), so it needs more pixels.
const SIZES = {
  hero: "100vw",
  // Gallery pages: the large photo is 2/3 of the 1104px row on desktop and the whole row on
  // phones; the small ones a third of the row, or half of it on phones.
  mosaicLarge: "(min-width: 768px) 740px, 100vw",
  mosaicSmall: "(min-width: 768px) 370px, 50vw",
  // Lightbox: at most 1152px wide and 85vh tall, 16px padding on each side.
  lightboxLandscape: "(min-width: 1184px) 1152px, calc(100vw - 32px)",
  lightboxPortrait: "(orientation: portrait) calc(100vw - 32px), 64vh",
  // Location map: 2/3 of the grid on desktop; on mobile a 420px tall box covered by a 16:10 map.
  map: "(min-width: 1024px) 900px, 672px",
};

// Address coordinates for Google Maps
const MAPS_QUERY = "Via+Paolo+Thaon+di+Revel+58,+Cavallino+Treporti,+Venezia";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

// Icons and order of the short lists; their texts are in i18n.ts.
const HERO_FACTS: { key: HeroFactKey; icon: IconName }[] = [
  { key: "pool", icon: "pool" },
  { key: "beach", icon: "beach" },
  { key: "guests", icon: "guests" },
];
const HIGHLIGHTS: { key: HighlightKey; icon: IconName }[] = [
  { key: "garden", icon: "pine" },
  { key: "location", icon: "pin" },
  { key: "space", icon: "area" },
  { key: "guests", icon: "guests" },
];
// Pool and beach are already in the hero facts and the highlights.
const AMENITIES: { key: AmenityKey; icon: IconName }[] = [
  { key: "ac", icon: "ac" },
  { key: "wifi", icon: "wifi" },
  { key: "kitchen", icon: "kitchen" },
  { key: "parking", icon: "parking" },
  { key: "checkin", icon: "key" },
  { key: "balcony", icon: "sun" },
];
const EXPERIENCES: { key: ExperienceKey; icon: IconName }[] = [
  { key: "venice", icon: "boat" },
  { key: "beach", icon: "beach" },
  { key: "active", icon: "bike" },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`fade-in-up ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Hero content: CSS fade-in on load, so it shows without waiting for JavaScript. */
function HeroFade({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div className="hero-fade" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/**
 * Section heading: short azure-to-green bar, eyebrow and title. `light` over dark photos,
 * `start` to align it left from tablets up (two-column sections).
 */
function SectionTitle({
  eyebrow,
  title,
  className = "",
  light = false,
  start = false,
}: {
  eyebrow: string;
  title: string;
  className?: string;
  light?: boolean;
  start?: boolean;
}) {
  return (
    <Reveal className={`${start ? "text-center md:text-left" : "text-center"} ${className}`}>
      <span
        className={`mb-5 block h-1 w-12 rounded-full bg-gradient-lagoon ${start ? "mx-auto md:mx-0" : "mx-auto"}`}
      />
      <p className={`text-xs uppercase tracking-[0.4em] ${light ? "text-aqua" : "text-primary"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 font-serif text-3xl md:text-5xl ${light ? "text-white" : ""}`}>
        {title}
      </h2>
    </Reveal>
  );
}

/** Gradient of the corner waves, defined once in the page. */
function WaveGradient() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <linearGradient id="lagoon-wave" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" style={{ stopColor: "var(--azure)" }} />
          <stop offset="100%" style={{ stopColor: "var(--aqua)" }} />
        </linearGradient>
      </defs>
    </svg>
  );
}

const WAVE = "M0 30 C 40 10, 80 10, 120 30 S 200 50, 240 30 S 300 12, 340 26";

/**
 * Decorative lagoon waves in a section corner: bottom left of one section and top right
 * of the next, so they seem to carry on down the page.
 */
function CornerWaves({ corner }: { corner: "top-right" | "bottom-left" }) {
  const place = corner === "top-right" ? "right-0 top-0" : "bottom-0 left-0 rotate-180";
  return (
    <svg
      viewBox="0 0 340 110"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute ${place} w-44 opacity-60 md:w-80`}
    >
      {[0, 20, 40, 60].map((dy) => (
        <path
          key={dy}
          d={WAVE}
          transform={`translate(0 ${dy})`}
          stroke="url(#lagoon-wave)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/**
 * Gallery in pages of three photos (one large, two small) that scroll sideways, with
 * arrows on large screens and dots below. A tap opens the photo in the lightbox.
 */
function GalleryMosaic({
  items,
  onOpen,
}: {
  items: { label: string; name: ImageName }[];
  onOpen: (index: number) => void;
}) {
  const { t } = useLang();
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  // Pages of three; if one photo would be left alone, the last two pages get two each
  const pages: number[][] = [];
  const n = items.length;
  const fullPages = n % 3 === 1 && n > 3 ? Math.floor(n / 3) - 1 : Math.floor(n / 3);
  for (let p = 0; p < fullPages; p++) pages.push([3 * p, 3 * p + 1, 3 * p + 2]);
  for (let i = 3 * fullPages; i < n; i += 2) {
    pages.push([i, i + 1].filter((j) => j < n));
  }

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setPage(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (p: number) => {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(pages.length - 1, p));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: target * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "absolute top-[260px] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lagoon-deep shadow-md transition-opacity hover:bg-muted disabled:opacity-0 md:flex";

  return (
    <div className="relative">
      <div ref={track} className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide">
        {pages.map((group, p) => (
          <div
            key={p}
            role="group"
            aria-label={`${t.ui.page} ${p + 1} / ${pages.length}`}
            className="grid w-full flex-shrink-0 snap-start grid-cols-2 gap-3 md:h-[520px] md:grid-cols-3 md:grid-rows-2 md:gap-4"
          >
            {group.map((i, j) => {
              const item = items[i];
              const large = j === 0;
              // A page with two photos: the second one fills the whole right column
              const tall = j === 1 && group.length === 2;
              const size = large
                ? "col-span-2 h-56 sm:h-72 md:row-span-2 md:h-auto"
                : tall
                  ? "col-span-2 h-40 sm:h-52 md:col-span-1 md:row-span-2 md:h-auto"
                  : "h-40 sm:h-52 md:h-auto";
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => onOpen(i)}
                  aria-label={`${item.label} — ${t.ui.openImage}`}
                  className={`group relative overflow-hidden rounded-2xl shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-lagoon focus-visible:ring-offset-2 focus-visible:ring-offset-background ${size}`}
                >
                  <Picture
                    name={item.name}
                    alt={t.alt[item.name]}
                    sizes={large ? SIZES.mosaicLarge : SIZES.mosaicSmall}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-lagoon-deep/75 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 right-4 text-left font-serif text-base text-white md:bottom-4 md:text-xl">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Arrows on large screens; phones swipe */}
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page === 0}
        aria-label={t.ui.prevPage}
        className={`${arrow} -left-5`}
      >
        <Icon name="left" size={22} />
      </button>
      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page === pages.length - 1}
        aria-label={t.ui.nextPage}
        className={`${arrow} -right-5`}
      >
        <Icon name="right" size={22} />
      </button>

      <div className="mt-5 flex justify-center gap-1">
        {pages.map((_, p) => (
          <button
            key={p}
            type="button"
            onClick={() => goTo(p)}
            aria-label={`${t.ui.page} ${p + 1}`}
            aria-current={p === page ? "true" : undefined}
            className="p-[7px]"
          >
            <span
              className={`block h-2.5 rounded-full transition-all ${p === page ? "w-7 bg-lagoon" : "w-2.5 bg-lagoon/25"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Static OpenStreetMap picture of the area with the building pin
 * (scripts/generate-static-map.mjs). A tap opens Google Maps in a new tab, so the
 * page itself makes no third-party requests and sets no cookies.
 */
function LocationMap() {
  const { t } = useLang();
  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-3xl shadow-soft">
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group absolute inset-0 block"
      >
        <Picture
          name="map-area"
          alt={t.alt["map-area"]}
          sizes={SIZES.map}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {/* At the bottom: the building pin sits in the middle of the map */}
        <span className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-lagoon-deep shadow-md">
          <Icon name="external" size={16} />
          {t.location.openMaps}
        </span>
      </a>
      {/* Map data licence (ODbL) requires the credit */}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-0 right-0 z-10 rounded-tl-lg bg-white/90 px-2 py-0.5 text-[11px] text-foreground"
      >
        © OpenStreetMap
      </a>
    </div>
  );
}

function Header() {
  const { t } = useLang();
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-6 py-5 md:px-10 md:py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#top" className="font-serif text-lg italic text-white drop-shadow-md md:text-xl">
          Cavallino Treporti
        </a>
        <nav className="hidden items-center gap-7 text-sm text-white/90 lg:flex">
          <a href="#gallery" className="hover:text-white transition-colors">
            {t.nav.gallery}
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            {t.nav.about}
          </a>
          <a href="#amenities" className="hover:text-white transition-colors">
            {t.nav.amenities}
          </a>
          <a href="#experiences" className="hover:text-white transition-colors">
            {t.nav.experiences}
          </a>
          <a href="#location" className="hover:text-white transition-colors">
            {t.nav.location}
          </a>
        </nav>
        <LanguageDropdown variant="dark" />
      </div>
    </header>
  );
}

function LandingInner() {
  const { t, lang } = useLang();

  const galleryItems: { label: string; name: ImageName }[] = [
    { label: t.gallery.pool, name: "real-pool" },
    { label: t.gallery.openspace, name: "real-openspace" },
    { label: t.gallery.living, name: "real-living" },
    { label: t.gallery.sofa, name: "real-sofa" },
    { label: t.gallery.mural, name: "real-mural" },
    { label: t.gallery.dining, name: "real-dining" },
    { label: t.gallery.kitchen, name: "real-kitchen" },
    { label: t.gallery.bedroomYellow, name: "real-bedroom-1" },
    { label: t.gallery.bedroom, name: "real-bedroom-4" },
    { label: t.gallery.bathroom, name: "real-bathroom-2" },
    { label: t.gallery.hallway, name: "real-hallway" },
    { label: t.gallery.balcony, name: "real-balcony" },
    { label: t.gallery.view, name: "real-view" },
    { label: t.gallery.pool, name: "real-pool-3" },
  ];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImg = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? i : (i - 1 + galleryItems.length) % galleryItems.length,
      ),
    [galleryItems.length],
  );
  const nextImg = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % galleryItems.length)),
    [galleryItems.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") prevImg();
      else if (e.key === "ArrowRight") nextImg();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, closeLightbox, prevImg, nextImg]);

  return (
    <main id="top" className="min-h-screen bg-background text-foreground">
      {/* Repeated meta: head() in the route would dedupe it by property. React hoists these into <head>. */}
      {LANGS.filter((l) => l.code !== lang).map((l) => (
        <meta key={l.code} property="og:locale:alternate" content={l.ogLocale} />
      ))}
      <Header />
      <WaveGradient />

      {/* HERO */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <Picture
          name="real-pool"
          alt={t.alt["real-pool"]}
          sizes={SIZES.hero}
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <HeroFade>
            <p className="mb-5 text-xs uppercase tracking-[0.25em] text-white/85 sm:tracking-[0.4em]">
              {t.hero.eyebrow}
            </p>
          </HeroFade>
          <HeroFade delay={120}>
            <h1 className="font-serif italic text-5xl leading-[1.05] sm:text-7xl md:text-8xl lg:text-9xl">
              Cavallino Treporti
            </h1>
          </HeroFade>
          <HeroFade delay={240}>
            <p className="mt-8 max-w-xl text-base text-white/90 sm:text-lg">{t.hero.subtitle}</p>
          </HeroFade>
          <HeroFade delay={300}>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {HERO_FACTS.map(({ key, icon }) => (
                <li
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:text-sm"
                >
                  <Icon name={icon} size={16} />
                  {t.hero.facts[key]}
                </li>
              ))}
            </ul>
          </HeroFade>
          <HeroFade delay={360}>
            <WhatsAppButton className="mt-7" />
          </HeroFade>
          <HeroFade delay={460}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/85">
              <a
                href={`tel:${PHONE_IT_DISPLAY.replace(/\s/g, "")}`}
                className="hover:text-white transition-colors"
              >
                {t.contact.callIt}: {PHONE_IT_DISPLAY}
              </a>
              <span className="hidden sm:inline text-white/40">·</span>
              <a
                href={`tel:${PHONE_DE_DISPLAY.replace(/\s/g, "")}`}
                className="hover:text-white transition-colors"
              >
                {t.contact.callDe}: {PHONE_DE_DISPLAY}
              </a>
            </div>
          </HeroFade>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/80 motion-safe:animate-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="relative overflow-hidden py-14 md:py-28">
        <CornerWaves corner="top-right" />
        <div className="relative mx-auto max-w-6xl px-6">
          <SectionTitle eyebrow={t.gallery.eyebrow} title={t.gallery.title} className="mb-12" />
          <Reveal>
            <GalleryMosaic items={galleryItems} onOpen={openLightbox} />
          </Reveal>
        </div>
        <CornerWaves corner="bottom-left" />
      </section>

      {/* ABOUT + AMENITIES: text and call to action left, highlights right, comfort icons below */}
      <section id="about" className="relative overflow-hidden py-14 md:py-28">
        <CornerWaves corner="top-right" />
        <CornerWaves corner="bottom-left" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <div className="text-center md:text-left">
              <SectionTitle eyebrow={t.about.eyebrow} title={t.about.title} start />
              <Reveal delay={100}>
                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:mx-0 md:text-lg">
                  {t.about.text}
                </p>
                {/* With no prices on the site, the only action is to write */}
                <p className="mt-6 text-sm text-muted-foreground">{t.contact.priceNote}</p>
                <WhatsAppButton className="mt-3" />
              </Reveal>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {HIGHLIGHTS.map(({ key, icon }, i) => (
                <Reveal key={key} delay={i * 80} className="h-full">
                  <div className="flex h-full flex-col items-center rounded-3xl bg-card/80 p-5 text-center shadow-soft md:p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-lagoon text-lagoon-deep">
                      <Icon name={icon} size={22} />
                    </span>
                    <h3 className="mt-4 font-serif text-lg leading-snug md:text-xl">
                      {t.about.highlights[key].title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t.about.highlights[key].text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="mt-12 md:mt-20">
            <div id="amenities" className="border-t border-border pt-10">
              <p className="text-center text-xs uppercase tracking-[0.3em] text-primary">
                {t.amenities.title}
              </p>
              <ul className="mt-8 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-6">
                {AMENITIES.map(({ key, icon }) => (
                  <li key={key} className="flex flex-col items-center gap-3 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-soft md:h-14 md:w-14">
                      <Icon name={icon} size={24} />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {t.amenities.items[key]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* EXPERIENCES: one panoramic photo of the lagoon behind the text */}
      <section
        id="experiences"
        className="relative overflow-hidden bg-lagoon-deep py-20 text-white md:py-32"
      >
        <Picture
          name="area-laguna"
          alt=""
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-lagoon-deep/80 via-lagoon-deep/60 to-lagoon-deep/85" />
        <div className="relative mx-auto max-w-6xl px-6">
          <SectionTitle eyebrow={t.experiences.eyebrow} title={t.experiences.title} light />
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {EXPERIENCES.map(({ key, icon }, i) => (
              <Reveal key={key} delay={i * 100} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-lagoon text-lagoon-deep">
                  <Icon name={icon} size={22} />
                </span>
                <h3 className="mt-4 font-serif text-2xl md:text-3xl">
                  {t.experiences.cards[key].title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/85 md:text-base">
                  {t.experiences.cards[key].text}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <p className="font-serif text-lg italic text-white/80 md:text-xl">
              {t.experiences.food}
            </p>
          </Reveal>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="relative overflow-hidden py-14 md:py-28">
        <CornerWaves corner="top-right" />
        <CornerWaves corner="bottom-left" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionTitle eyebrow={t.location.eyebrow} title={t.location.title} className="mb-12" />

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <Reveal className="lg:col-span-1">
              <div className="flex h-full flex-col rounded-3xl bg-lagoon-deep p-8 text-white shadow-soft md:p-10">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">{t.ui.address}</p>
                <p className="mt-4 font-serif text-2xl leading-snug md:text-3xl">
                  {t.location.address}
                </p>
                <p className="mt-1 text-white/85">{t.location.tagline}</p>

                <div className="mt-8 space-y-3">
                  {[
                    { d: "5 min", l: t.location.beach },
                    { d: "20 min", l: t.location.venice },
                    { d: "15 min", l: t.location.murano },
                  ].map((b) => (
                    <div
                      key={b.l}
                      className="flex items-center justify-between rounded-full bg-white/10 px-5 py-3"
                    >
                      <span className="font-serif text-lg text-aqua">{b.d}</span>
                      <span className="text-sm text-white/85">{b.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-2">
              <LocationMap />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER: the lagoon village of Lio Piccolo, faded into the lagoon colours */}
      <footer
        id="book"
        className="relative overflow-hidden bg-lagoon-deep py-20 text-white md:py-28"
      >
        <Picture
          name="area-liopiccolo"
          alt=""
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-lagoon-deep/55 via-lagoon-deep/70 to-[#12463f]/95" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="font-serif italic text-4xl md:text-6xl">Cavallino Treporti</h2>
            <p className="mt-4 italic text-white/75 md:text-lg">{t.footer.tagline}</p>
            <WhatsAppButton className="mt-8" />
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/85">
              <a
                href={`tel:${PHONE_IT_DISPLAY.replace(/\s/g, "")}`}
                className="hover:text-white transition-colors"
              >
                {t.contact.callIt}: {PHONE_IT_DISPLAY}
              </a>
              <a
                href={`tel:${PHONE_DE_DISPLAY.replace(/\s/g, "")}`}
                className="hover:text-white transition-colors"
              >
                {t.contact.callDe}: {PHONE_DE_DISPLAY}
              </a>
            </div>
            <div className="mt-14 border-t border-white/15 pt-8 text-sm text-white/55">
              © {new Date().getFullYear()} {t.footer.rights}
              {/* National identification code, shown only when set in contact.ts */}
              {CIN && <p className="mt-2 text-white/75">CIN {CIN}</p>}
            </div>
          </Reveal>
        </div>
      </footer>

      <WhatsAppFloatingButton />

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={galleryItems[lightboxIndex].label}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label={t.ui.close}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevImg();
            }}
            aria-label={t.ui.previous}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-8"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextImg();
            }}
            aria-label={t.ui.next}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-8"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <figure
            className="relative flex max-h-full max-w-6xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Picture
              key={galleryItems[lightboxIndex].name}
              name={galleryItems[lightboxIndex].name}
              alt={t.alt[galleryItems[lightboxIndex].name]}
              sizes={
                isLandscape(galleryItems[lightboxIndex].name)
                  ? SIZES.lightboxLandscape
                  : SIZES.lightboxPortrait
              }
              priority
              className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-center font-serif text-base text-white/90 md:text-lg">
              {galleryItems[lightboxIndex].label}
              <span className="ml-3 text-sm text-white/50">
                {lightboxIndex + 1} / {galleryItems.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}

export function Landing({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <LandingInner />
    </LangProvider>
  );
}
