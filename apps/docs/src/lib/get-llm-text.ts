import type { source } from "@/lib/source";

type DocsPage = NonNullable<ReturnType<typeof source.getPage>>;

export async function getLLMText(page: DocsPage) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})\n\n${processed}`;
}
