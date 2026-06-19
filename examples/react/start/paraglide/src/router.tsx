import { createRouter } from "@tanstack/react-router";
import { DEFAULT_LOCALE } from "@/constants/locales";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    context: {
      locale: DEFAULT_LOCALE,
    },
    scrollRestoration: true,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
