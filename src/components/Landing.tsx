import { useCallback, useEffect, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { LangProvider, useLang } from "@/hooks/use-lang";
import { BubbleDivider } from "@/components/BubbleDivider";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { Picture } from "@/components/Picture";
import { isLandscape, type ImageName } from "@/lib/images";
import { LANGS, type Lang } from "@/lib/i18n";
import { PHONE_DE_DISPLAY, PHONE_IT_DISPLAY, WHATSAPP_DE, WHATSAPP_IT } from "@/lib/contact";

// `sizes` for each image slot: its rendered width. With object-cover a landscape (4:3)
// photo in a taller box is wider than the box (box height × 4/3), so it needs more pixels.
const SIZES = {
  hero: "100vw",
  // Gallery cards: 280×360 below 640px, 360×360 up to 768px, 420×460 above.
  galleryLandscape: "(min-width: 768px) 614px, 480px",
  galleryPortrait: "(min-width: 768px) 420px, (min-width: 640px) 360px, 280px",
  // About collage: boxes about 280px wide on desktop, half the column on mobile.
  mural: "(min-width: 768px) 470px, 83vw", // landscape photo in a 4:5 box
  sofa: "(min-width: 768px) 375px, 67vw", // landscape photo in a square box
  kitchen: "(min-width: 768px) 280px, 50vw", // portrait photo in a square box
  // Lightbox: at most 1152px wide and 85vh tall, 16px padding on each side.
  lightboxLandscape: "(min-width: 1184px) 1152px, calc(100vw - 32px)",
  lightboxPortrait: "(orientation: portrait) calc(100vw - 32px), 64vh",
};

// Address coordinates for Google Maps
const MAPS_QUERY = "Via+Paolo+Thaon+di+Revel+58,+Cavallino+Treporti,+Venezia";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
const MAPS_EMBED = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;

// The German page writes to the German number, the other languages to the Italian one.
const whatsappUrl = (lang: Lang, message: string) =>
  `https://wa.me/${lang === "de" ? WHATSAPP_DE : WHATSAPP_IT}?text=${encodeURIComponent(message)}`;
const expMapUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${q}`;

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`fade-in-up ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Header() {
  const { t } = useLang();
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-6 py-5 md:px-10 md:py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#top" className="font-serif text-lg italic text-white drop-shadow-md md:text-xl">
          CavallinoTreporti
        </a>
        <nav className="hidden items-center gap-7 text-sm text-white/90 lg:flex">
          <a href="#gallery" className="hover:text-white transition-colors">{t.nav.gallery}</a>
          <a href="#about" className="hover:text-white transition-colors">{t.nav.about}</a>
          <a href="#amenities" className="hover:text-white transition-colors">{t.nav.amenities}</a>
          <a href="#experiences" className="hover:text-white transition-colors">{t.nav.experiences}</a>
          <a href="#location" className="hover:text-white transition-colors">{t.nav.location}</a>
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
    { label: t.gallery.kitchen, name: "real-kitchen" },
    { label: t.gallery.mural, name: "real-mural" },
    { label: t.gallery.bedroomYellow, name: "real-bedroom-1" },
    { label: t.gallery.bedroom, name: "real-bedroom-2" },
    { label: t.gallery.bedroom, name: "real-bedroom-3" },
    { label: t.gallery.bathroom, name: "real-bathroom-2" },
    { label: t.gallery.bathroom, name: "real-bathroom-4" },
    { label: t.gallery.hallway, name: "real-hallway" },
    { label: t.gallery.balcony, name: "real-balcony" },
    { label: t.gallery.entrance, name: "real-entrance" },
  ];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImg = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i - 1 + galleryItems.length) % galleryItems.length)),
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
          <Reveal>
            <p className="mb-5 text-xs uppercase tracking-[0.4em] text-white/85">
              {t.hero.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="font-serif italic text-5xl leading-[1.05] sm:text-7xl md:text-8xl lg:text-9xl">
              CavallinoTreporti
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-8 max-w-xl text-base text-white/90 sm:text-lg">
              {t.hero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={360}>
            <a
              href={whatsappUrl(lang, t.contact.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366]/85 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#25D366]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">


                <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              {t.contact.whatsappCta}
            </a>
          </Reveal>
          <Reveal delay={460}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/85">
              <a href={`tel:${PHONE_IT_DISPLAY.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                🇮🇹 {t.contact.callIt}: {PHONE_IT_DISPLAY}
              </a>
              <span className="hidden sm:inline text-white/40">·</span>
              <a href={`tel:${PHONE_DE_DISPLAY.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                🇩🇪 {t.contact.callDe}: {PHONE_DE_DISPLAY}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/80 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-primary">{t.gallery.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">{t.gallery.title}</h2>
          </Reveal>
        </div>

        <Reveal>
          <div className="flex gap-5 overflow-x-auto px-6 pb-6 scrollbar-hide snap-x snap-mandatory md:px-12">
            {galleryItems.map((item, i) => (
              <button
                type="button"
                key={`${item.label}-${i}`}
                onClick={() => openLightbox(i)}
                aria-label={`${item.label} — ${t.ui.openImage}`}
                className="group relative flex-shrink-0 snap-start overflow-hidden rounded-3xl shadow-soft w-[280px] sm:w-[360px] md:w-[420px] h-[360px] md:h-[460px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
              >
                <Picture
                  name={item.name}
                  alt={t.alt[item.name]}
                  sizes={isLandscape(item.name) ? SIZES.galleryLandscape : SIZES.galleryPortrait}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.22_0.03_220/0.85)] via-transparent to-transparent" />
                <figcaption className="absolute bottom-5 left-5 right-5 text-left font-serif text-xl text-white md:text-2xl">
                  {item.label}
                </figcaption>
              </button>

            ))}
          </div>
        </Reveal>
      </section>

      <BubbleDivider />


      {/* ABOUT */}
      <section id="about" className="py-20 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2 md:gap-20">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-primary">{t.about.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">
              {t.about.title}
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              <p>{t.about.p1}</p>
              <p>
                {t.about.p2a}
                <span className="text-foreground font-medium">{t.about.mural}</span>
                {t.about.p2b}
                <span className="text-foreground font-medium">{t.about.marble}</span>
                {t.about.p2c}
                <span className="text-foreground font-medium">{t.about.yellow}</span>
                {t.about.p2d}
                <span className="text-foreground font-medium">{t.about.teal}</span>
                {t.about.p2e}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {[t.about.sqm, t.about.guests, t.about.bedroom, t.about.balcony].map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-4">
              <Picture name="real-mural" alt={t.alt["real-mural"]} sizes={SIZES.mural} className="aspect-[4/5] w-full rounded-3xl object-cover shadow-soft" />
              {/* gap instead of space-y: margins don't apply to the display:contents <picture> */}
              <div className="flex flex-col gap-4 pt-10">
                <Picture name="real-kitchen" alt={t.alt["real-kitchen"]} sizes={SIZES.kitchen} className="aspect-square w-full rounded-3xl object-cover shadow-soft" />
                <Picture name="real-sofa" alt={t.alt["real-sofa"]} sizes={SIZES.sofa} className="aspect-square w-full rounded-3xl object-cover shadow-soft" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AMENITIES */}
      <section id="amenities" className="bg-[var(--marble)] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-14 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-primary">{t.amenities.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">{t.amenities.title}</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-x-10 gap-y-1 sm:grid-cols-2 md:grid-cols-3">
            {t.amenities.items.map((label, i) => (
              <Reveal key={label} delay={(i % 6) * 50}>
                <div className="flex items-center gap-4 border-b border-border/60 py-4">
                  <span className="font-serif text-sm text-primary tabular-nums w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-shrink-0 w-6 bg-[var(--amber-brand)]" />
                  <span className="text-sm font-medium text-foreground md:text-base">{label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BubbleDivider />

      {/* EXPERIENCES */}
      <section id="experiences" className="py-20 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal className="mb-10">
            <p className="text-xs uppercase tracking-[0.4em] text-primary">{t.experiences.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">{t.experiences.title}</h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t.experiences.narrative.map((seg, i) =>
                seg.type === "link" ? (
                  <a
                    key={i}
                    href={expMapUrl(seg.query)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline decoration-[var(--amber-brand)] underline-offset-4 transition-colors hover:text-[var(--amber-deep)]"
                  >
                    {seg.value}
                  </a>
                ) : (
                  <span key={i}>{seg.value}</span>
                )
              )}
            </p>
          </Reveal>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="bg-[var(--marble)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mb-14 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-primary">{t.location.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">{t.location.title}</h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <Reveal className="lg:col-span-1">
              <div className="flex h-full flex-col rounded-3xl bg-[var(--teal-deep)] p-8 text-white shadow-soft md:p-10">
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
                    <div key={b.l} className="flex items-center justify-between rounded-full border border-white/20 bg-white/5 px-5 py-3">
                      <span className="font-serif text-lg text-[var(--amber-brand)]">{b.d}</span>
                      <span className="text-sm text-white/85">{b.l}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-amber px-6 py-3 text-sm font-semibold text-[oklch(0.25_0.04_60)] transition-transform hover:scale-105"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {t.location.openMaps}
                </a>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-2">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.location.openMaps}
                className="relative block h-full min-h-[420px] overflow-hidden rounded-3xl shadow-soft"
              >
                <iframe
                  src={MAPS_EMBED}
                  title="Google Maps — Cavallino Treporti"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
                <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-foreground shadow-md backdrop-blur-sm">
                  📍 {t.location.openMaps}
                </div>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="book" className="bg-[var(--teal-deep)] py-20 text-white md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="font-serif italic text-4xl md:text-6xl">CavallinoTreporti</h2>
            <p className="mt-4 italic text-white/75 md:text-lg">{t.footer.tagline}</p>
            <a
              href={whatsappUrl(lang, t.contact.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366]/85 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#25D366]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">


                <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              {t.contact.whatsappCta}
            </a>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/85">
              <a href={`tel:${PHONE_IT_DISPLAY.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                🇮🇹 {t.contact.callIt}: {PHONE_IT_DISPLAY}
              </a>
              <a href={`tel:${PHONE_DE_DISPLAY.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                🇩🇪 {t.contact.callDe}: {PHONE_DE_DISPLAY}
              </a>
            </div>
            <div className="mt-14 border-t border-white/15 pt-8 text-sm text-white/55">
              © {new Date().getFullYear()} CavallinoTreporti · {t.footer.rights}
            </div>
          </Reveal>
        </div>
      </footer>

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
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            aria-label={t.ui.close}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prevImg(); }}
            aria-label={t.ui.previous}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-8"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); nextImg(); }}
            aria-label={t.ui.next}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-8"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
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
              sizes={isLandscape(galleryItems[lightboxIndex].name) ? SIZES.lightboxLandscape : SIZES.lightboxPortrait}
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
