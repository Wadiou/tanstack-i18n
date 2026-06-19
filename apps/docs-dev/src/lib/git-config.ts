export const gitConfig = {
  user: "Wadiou",
  repo: "tanstack-i18n",
  branch: "main",
} as const;

export function buildGithubRepoUrl() {
  return `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
}
