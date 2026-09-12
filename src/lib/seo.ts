import { DEFAULT_LANG, LANGS, translations, type Lang } from "@/lib/i18n";
import { imagePreload } from "@/lib/images";

export const SITE_URL = "https://venicelagoonbeachpoolcavallino.com";

const pathOf = (lang: Lang) => LANGS.find((l) => l.code === lang)!.path;

/**
 * head() of a landing page: title and description in the page language, absolute
 * canonical URL and reciprocal hreflang links (every page lists all languages).
 */
export function pageHead(lang: Lang) {
  const { title, description } = translations[lang].meta;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [
      { rel: "canonical", href: SITE_URL + pathOf(lang) },
      ...LANGS.map((l) => ({ rel: "alternate", hrefLang: l.code, href: SITE_URL + l.path })),
      { rel: "alternate", hrefLang: "x-default", href: SITE_URL + pathOf(DEFAULT_LANG) },
      // Hero photo is the LCP element: start downloading it before the CSS is parsed.
      imagePreload("real-pool", "100vw"),
    ],
  };
}
