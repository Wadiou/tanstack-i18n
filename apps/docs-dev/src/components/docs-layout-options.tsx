import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { DocsLogo } from "@/components/docs-logo";
import { buildGithubRepoUrl } from "@/lib/git-config";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <DocsLogo className="h-10 w-auto" />,
    },
    githubUrl: buildGithubRepoUrl(),
  };
}

export const docsLayoutOptions = {
  sidebar: {
    defaultOpenLevel: 1,
  },
};
