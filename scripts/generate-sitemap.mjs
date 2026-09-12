/**
 * Writes public/sitemap.xml: one <url> per language page, each listing all
 * language versions as xhtml:link alternates (the same hreflang set as the
 * <link rel="alternate"> tags in the page head, see src/lib/seo.ts).
 */
import { writeFile } from "node:fs/promises";

const SITE_URL = "https://venicelagoonbeachpoolcavallino.com";
// Keep in sync with LANGS in src/lib/i18n.ts; the first entry is also x-default.
const PAGES = [
  { lang: "it", path: "/" },
  { lang: "en", path: "/en/" },
  { lang: "de", path: "/de/" },
];
const OUT = "public/sitemap.xml";

const alternates = [
  ...PAGES.map((p) => ({ hreflang: p.lang, href: SITE_URL + p.path })),
  { hreflang: "x-default", href: SITE_URL + PAGES[0].path },
]
  .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`)
  .join("\n");

const urls = PAGES.map(
  (p) => `  <url>\n    <loc>${SITE_URL + p.path}</loc>\n${alternates}\n  </url>`,
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

await writeFile(OUT, xml, "utf8");
console.log(`[sitemap] ${PAGES.length} pages -> ${OUT}`);
