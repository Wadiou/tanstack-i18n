import { createFileRoute } from "@tanstack/react-router";
import {
  DOMAIN,
  SITEMAP_CHANGE_FREQ,
  SITEMAP_DEFAULT_PRIORITY,
  SITEMAP_HOME_PRIORITY,
} from "@/constants/seo";
import {
  sitemapIndexTemplate,
  sitemapUrlTemplate,
} from "@/constants/templates/sitemap";
import { source } from "@/lib/source";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const pages = source.getPages();

        const urlsXml = pages
          .map((page) => {
            const loc = `${DOMAIN}${page.url === "/" ? "" : page.url}`;
            const lastmod = new Date().toISOString();
            const priority =
              page.url === "/"
                ? SITEMAP_HOME_PRIORITY
                : SITEMAP_DEFAULT_PRIORITY;

            return sitemapUrlTemplate(
              loc,
              lastmod,
              SITEMAP_CHANGE_FREQ,
              priority
            );
          })
          .join("\n");

        const sitemapXml = sitemapIndexTemplate(urlsXml);

        return new Response(sitemapXml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
          },
        });
      },
    },
  },
});
