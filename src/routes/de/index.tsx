import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/Landing";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/de/")({
  component: () => <Landing lang="de" />,
  head: () => pageHead("de"),
});
