export const gitConfig = {
  user: "Wadiou",
  repo: "tanstack-i18n",
  branch: "main",
} as const;

/** Git blob path prefix for Edit on GitHub (public docs content root). */
export const docsContentRoot = "apps/docs/content";

export function buildGithubRepoUrl() {
  return `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
}
