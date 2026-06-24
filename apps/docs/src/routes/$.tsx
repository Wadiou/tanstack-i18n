import { createFileRoute } from "@tanstack/react-router";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { Suspense } from "react";
import {
  baseOptions,
  docsLayoutOptions,
} from "@/components/docs-layout-options";
import { docsClientLoader } from "@/components/docs-page-content";
import { DocsSiteFooter } from "@/components/docs-site-footer";
import { DOMAIN, OG_ALT, OG_IMAGE, TITLE_SUFFIX } from "@/constants/seo";
import { docsServerLoader } from "@/lib/docs-server-loader";

export const Route = createFileRoute("/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/").filter(Boolean) ?? [];
    const data = await docsServerLoader({ data: slugs });
    await docsClientLoader.preload(data.path);
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }

    const title = `${loaderData.frontmatter.title}${TITLE_SUFFIX}`;
    const description = loaderData.frontmatter.description || "";
    const pathname = loaderData.slugs.length
      ? `/${loaderData.slugs.join("/")}`
      : "/";
    const canonicalUrl = `${DOMAIN}${pathname === "/" ? "" : pathname}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        // OpenGraph
        { property: "og:title", content: loaderData.frontmatter.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: OG_IMAGE },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: OG_ALT },
        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.frontmatter.title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DocsLayout
        {...baseOptions()}
        {...docsLayoutOptions}
        tree={data.pageTree}
      >
        <Suspense>{docsClientLoader.useContent(data.path)}</Suspense>
      </DocsLayout>
      <DocsSiteFooter />
    </div>
  );
}
