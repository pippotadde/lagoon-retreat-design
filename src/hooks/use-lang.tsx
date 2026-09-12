import { createContext, useContext, type ReactNode } from "react";
import { translations, type Lang } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  t: (typeof translations)[Lang];
};

const LangContext = createContext<Ctx | null>(null);

/** Provides the page language, which is fixed by the route (/, /en/, /de/). */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <LangContext.Provider value={{ lang, t: translations[lang] }}>{children}</LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be inside LangProvider");
  return ctx;
}
