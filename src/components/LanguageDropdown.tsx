import { useState, useRef, useEffect } from "react";
import { useLang } from "@/hooks/use-lang";
import { LANGS } from "@/lib/i18n";

type Props = { variant?: "light" | "dark" };

export function LanguageDropdown({ variant = "light" }: Props) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LANGS.find((l) => l.code === lang)!;
  const isDark = variant === "dark";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="language-menu"
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
          isDark
            ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
            : "border-border bg-card text-foreground hover:bg-muted"
        }`}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden uppercase">{current.code}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Always rendered (hidden when closed) so the links to the other languages are in the HTML */}
      <ul
        id="language-menu"
        className={`absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-border bg-card shadow-warm z-50 ${
          open ? "" : "hidden"
        }`}
      >
        {LANGS.map((l) => (
          <li key={l.code}>
            <a
              href={l.path}
              hrefLang={l.code}
              lang={l.code}
              aria-current={l.code === lang ? "page" : undefined}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted ${
                l.code === lang ? "bg-muted font-semibold text-primary" : "text-foreground"
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
