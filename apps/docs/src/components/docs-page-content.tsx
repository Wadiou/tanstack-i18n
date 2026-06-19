import { getRouteApi } from "@tanstack/react-router";
import browserCollections from "collections/browser";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import type { TOCItemType } from "fumadocs-core/toc";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  MarkdownCopyButton,
} from "fumadocs-ui/layouts/docs/page";
import type { MDXComponents } from "mdx/types";
import { type ComponentType, useMemo } from "react";
import { getMDXComponents } from "@/components/mdx";
import { buildGithubEditUrl, buildMarkdownUrl } from "@/lib/url-helpers";

const docsPageRoute = getRouteApi("/$");

interface DocsPageContentProps {
  default: ComponentType<{ components?: MDXComponents }>;
  frontmatter: { title: string; description?: string };
  toc: TOCItemType[];
}

function DocsPageContent({
  toc,
  frontmatter,
  default: MDX,
}: DocsPageContentProps) {
  const data = useFumadocsLoader(docsPageRoute.useLoaderData());
  const githubUrl = buildGithubEditUrl(data.path);
  const markdownUrl = buildMarkdownUrl(data.path);
  const mdxComponents = useMemo(() => getMDXComponents(), []);

  return (
    <DocsPage
      tableOfContent={{ style: "clerk" }}
      tableOfContentPopover={{ style: "clerk" }}
      toc={toc}
    >
      <DocsTitle>{frontmatter.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {frontmatter.description}
      </DocsDescription>
      {markdownUrl ? (
        <div className="flex flex-row items-center gap-2 border-b pt-2 pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl}>
            Copy Markdown
          </MarkdownCopyButton>
        </div>
      ) : null}
      <DocsBody>
        <MDX components={mdxComponents} />
      </DocsBody>
      {githubUrl ? <EditOnGitHub className="mt-8" href={githubUrl} /> : null}
    </DocsPage>
  );
}

export const docsClientLoader = browserCollections.docs.createClientLoader({
  component: DocsPageContent,
});
