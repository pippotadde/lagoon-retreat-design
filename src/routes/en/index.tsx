import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/Landing";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/")({
  component: () => <Landing lang="en" />,
  head: () => pageHead("en"),
});
