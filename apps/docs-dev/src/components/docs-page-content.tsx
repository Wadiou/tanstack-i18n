import browserCollections from "collections/browser";
import type { TOCItemType } from "fumadocs-core/toc";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import type { MDXComponents } from "mdx/types";
import { type ComponentType, useMemo } from "react";
import { getMDXComponents } from "@/components/mdx";

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
  const mdxComponents = useMemo(() => getMDXComponents(), []);

  return (
    <DocsPage
      tableOfContent={{ style: "clerk" }}
      tableOfContentPopover={{ style: "clerk" }}
      toc={toc}
    >
      <DocsTitle>{frontmatter.title}</DocsTitle>
      <DocsDescription>{frontmatter.description}</DocsDescription>
      <DocsBody>
        <MDX components={mdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export const docsClientLoader = browserCollections.docs.createClientLoader({
  component: DocsPageContent,
});
