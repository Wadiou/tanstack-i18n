import { buildGithubRepoUrl } from "@/lib/git-config";

export function DocsSiteFooter() {
  const year = new Date().getFullYear();
  const githubUrl = buildGithubRepoUrl();

  return (
    <footer className="border-t bg-fd-background px-4 py-6 md:px-6">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-4 text-sm">
        <p className="text-fd-muted-foreground">© {year} Abd el-wadoud</p>
        <nav className="flex flex-wrap items-center gap-6 font-medium">
          <a
            className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            href={githubUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
