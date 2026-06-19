import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLLMText } from "@/lib/get-llm-text";
import { source } from "@/lib/source";
import { markdownPathToSlugs } from "@/lib/url-helpers";

export const Route = createFileRoute("/{$}.md")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slugs = markdownPathToSlugs(
          params._splat?.split("/").filter(Boolean) ?? []
        );
        const page = source.getPage(slugs);

        if (!page) {
          throw notFound();
        }

        return new Response(await getLLMText(page), {
          headers: {
            "Content-Type": "text/markdown",
          },
        });
      },
    },
  },
});
