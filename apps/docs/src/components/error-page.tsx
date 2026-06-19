import { type ErrorComponentProps, useRouter } from "@tanstack/react-router";
import Link from "fumadocs-core/link";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { HomeIcon, RefreshCwIcon } from "lucide-react";
import { baseOptions } from "@/components/docs-layout-options";

export function ErrorPage({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  function retry() {
    reset();
    router.invalidate();
  }

  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        <h1 className="font-bold text-6xl text-fd-muted-foreground">Error</h1>
        <h2 className="font-semibold text-2xl">Something went wrong</h2>
        {import.meta.env.DEV ? (
          <p className="max-w-md text-fd-muted-foreground text-sm">
            {error.message}
          </p>
        ) : (
          <p className="max-w-md text-fd-muted-foreground">
            An unexpected error occurred. Try again or return home.
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            className={buttonVariants({
              className: "gap-1.5",
              variant: "outline",
            })}
            onClick={retry}
            type="button"
          >
            <RefreshCwIcon className="size-4" />
            Try again
          </button>
          <Link
            className={buttonVariants({
              className: "gap-1.5",
              variant: "primary",
            })}
            href="/"
          >
            <HomeIcon className="size-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </HomeLayout>
  );
}
