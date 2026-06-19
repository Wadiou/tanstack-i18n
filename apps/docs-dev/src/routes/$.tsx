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
import { docsServerLoader } from "@/lib/docs-server-loader";

export const Route = createFileRoute("/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/").filter(Boolean) ?? [];
    const data = await docsServerLoader({ data: slugs });
    await docsClientLoader.preload(data.path);
    return data;
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
