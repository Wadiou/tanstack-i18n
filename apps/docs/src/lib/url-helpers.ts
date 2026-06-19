import { docsContentRoot, gitConfig } from "@/lib/git-config";

const leadingSlash = /^\//;
const markdownSuffix = /\.mdx?$/;
const indexPageSlug = "index";

/** Convert a markdown path to an array of slugs. */
export function markdownPathToSlugs(segs: string[]): string[] {
  if (segs.length === 0) {
    return [];
  }

  const out = [...segs];
  const last = out.at(-1);
  if (!last) {
    return [];
  }

  out[out.length - 1] = last.replace(markdownSuffix, "");
  if (out.length === 1 && out[0] === indexPageSlug) {
    out.pop();
  }

  return out;
}

export function buildMarkdownUrl(pagePath: string): string {
  const relative = pagePath
    .replace(leadingSlash, "")
    .replace(markdownSuffix, "");
  const segments =
    relative && relative !== indexPageSlug ? relative.split("/") : [];

  if (segments.length === 0) {
    segments.push(`${indexPageSlug}.md`);
  } else {
    segments[segments.length - 1] += ".md";
  }

  return `/${segments.join("/")}`;
}

export function buildGithubEditUrl(pagePath: string) {
  const relative = pagePath
    .replace(leadingSlash, "")
    .replace(markdownSuffix, "");
  const filePath = `${docsContentRoot}/${relative}.mdx`;

  return `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${filePath}`;
}
