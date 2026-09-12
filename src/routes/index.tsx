import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/Landing";
import { imagePreload } from "@/lib/images";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Venice Lagoon Beach & Pool Retreat — Cavallino Treporti" },
      {
        name: "description",
        content:
          "A relaxing escape between Venice and the sea. Modern Italian coastal apartment with private pool, pine forest views and beach walkable in Cavallino Treporti.",
      },
      { property: "og:title", content: "Venice Lagoon Beach & Pool Retreat" },
      {
        property: "og:description",
        content: "A relaxing escape between Venice and the sea — Cavallino Treporti, Italy.",
      },
      { property: "og:type", content: "website" },
    ],
    // Hero photo is the LCP element: start downloading it before the CSS is parsed.
    links: [imagePreload("real-pool", "100vw")],
  }),
});
