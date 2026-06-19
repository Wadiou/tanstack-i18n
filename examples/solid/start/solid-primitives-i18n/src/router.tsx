import { createRouter } from "@tanstack/solid-router";
import { DEFAULT_LOCALE } from "@/constants/locales";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    context: {
      locale: DEFAULT_LOCALE,
      messages: {} as Record<string, string>,
    },
    scrollRestoration: true,
  });
}

declare module "@tanstack/solid-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
