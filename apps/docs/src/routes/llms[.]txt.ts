import { createFileRoute } from "@tanstack/react-router";
import { LLMS_HEADER } from "@/constants/templates/llms-header";
import { source } from "@/lib/source";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () => {
        const pages = source.getPages();

        const pageList = pages
          .map((page) => {
            const mdUrl = page.url === "/" ? "/index.md" : `${page.url}.md`;
            return `- [${page.data.title}](${mdUrl})${
              page.data.description ? `: ${page.data.description}` : ""
            }`;
          })
          .join("\n");

        return new Response(`${LLMS_HEADER}${pageList}\n`, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      },
    },
  },
});
