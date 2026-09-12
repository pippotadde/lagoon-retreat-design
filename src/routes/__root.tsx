import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";

import { langFromPath } from "@/lib/i18n";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cavallini Treporti" },
      { name: "description", content: "A vacation rental landing page for Venice Lagoon Beach & Pool Retreat." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Cavallini Treporti" },
      { property: "og:description", content: "A vacation rental landing page for Venice Lagoon Beach & Pool Retreat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Cavallini Treporti" },
      { name: "twitter:description", content: "A vacation rental landing page for Venice Lagoon Beach & Pool Retreat." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e54e0bf8-0e94-407e-8ed2-e198ba03f777/id-preview-3a283bf6--5292facf-4167-48e1-9df4-7058ae3b50fd.lovable.app-1778157969508.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e54e0bf8-0e94-407e-8ed2-e198ba03f777/id-preview-3a283bf6--5292facf-4167-48e1-9df4-7058ae3b50fd.lovable.app-1778157969508.png" },
    ],
    links: [
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
