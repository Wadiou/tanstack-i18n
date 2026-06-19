import type mermaid from "mermaid";
import { useTheme } from "next-themes";
import { use, useEffect, useId, useState } from "react";

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return <MermaidContent chart={chart} />;
}

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(
  key: string,
  setPromise: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key);
  if (cached) {
    return cached as Promise<T>;
  }

  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

function MermaidContent({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme();
  const { default: mermaidLib } = use(
    cachePromise("mermaid", () => import("mermaid"))
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    mermaidLib.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      fontFamily: "inherit",
      themeCSS: "margin: 1.5rem auto 0;",
      theme: resolvedTheme === "dark" ? "dark" : "default",
    });
    setReady(true);
  }, [mermaidLib, resolvedTheme]);

  if (!ready) {
    return null;
  }

  return (
    <MermaidSvg
      chart={chart}
      mermaid={mermaidLib}
      resolvedTheme={resolvedTheme}
    />
  );
}

function MermaidSvg({
  chart,
  mermaid: mermaidLib,
  resolvedTheme,
}: {
  chart: string;
  mermaid: typeof mermaid;
  resolvedTheme?: string;
}) {
  const id = useId();
  const { svg, bindFunctions } = use(
    cachePromise(`${chart}-${resolvedTheme}`, () =>
      mermaidLib.render(id, chart.replaceAll("\\n", "\n"))
    )
  );

  return (
    <div
      className="my-6 flex w-full justify-center [&>svg]:mx-auto"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid svg is safe
      dangerouslySetInnerHTML={{ __html: svg }}
      ref={(container) => {
        if (container) {
          bindFunctions?.(container);
        }
      }}
    />
  );
}
