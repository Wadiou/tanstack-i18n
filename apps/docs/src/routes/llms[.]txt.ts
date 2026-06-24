import { createFileRoute } from "@tanstack/react-router";
import { source } from "@/lib/source";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () => {
        const pages = source.getPages();

        const header = `# TanStack i18n Documentation

Locale routing, persistence, and TanStack Start/Router adapters for i18n.

## Markdown Alternative Formats
Every page in these docs is available in raw, unformatted markdown. Append \`.md\` to any documentation URL path (e.g. \`/get-started.md\`) to retrieve the raw text source.

## Documentation Index
`;

        const pageList = pages
          .map((page) => {
            const mdUrl = page.url === "/" ? "/index.md" : `${page.url}.md`;
            return `- [${page.data.title}](${mdUrl})${
              page.data.description ? `: ${page.data.description}` : ""
            }`;
          })
          .join("\n");

        return new Response(`${header}${pageList}\n`, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      },
    },
  },
});
