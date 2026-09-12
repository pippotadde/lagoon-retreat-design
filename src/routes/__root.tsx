import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";

import { LANGS, langFromPath, translations } from "@/lib/i18n";
import appCss from "../styles.css?url";

// Prerendered as 404.html, which GitHub Pages serves for every unknown URL in any
// language: so it speaks all of them and links to each home page.
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <ul className="mt-8 space-y-6">
          {LANGS.map((l) => (
            <li key={l.code} lang={l.code}>
              <p className="text-lg font-semibold text-foreground">
                {translations[l.code].notFound.title}
              </p>
              <a
                href={l.path}
                hrefLang={l.code}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {translations[l.code].notFound.back}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      // Fallback for pages without their own head(); landing pages set theirs in src/lib/seo.ts
      { title: "Cavallino Treporti" },
      { property: "og:type", content: "website" },
      // X/Twitter reads title, description and image from the og: tags
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      // Fonts used above the fold (body text and the italic hero title); see @font-face in styles.css
      {
        rel: "preload",
        href: "/fonts/inter-latin-wght.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/playfair-display-italic-latin-400.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const lang = useRouterState({ select: (s) => langFromPath(s.location.pathname) });
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
