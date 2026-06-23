import { createRouter } from "@tanstack/react-router";
import { DEFAULT_LOCALE } from "@/constants/locales";
import type { Messages } from "@/types/i18n";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    context: {
      locale: DEFAULT_LOCALE,
      messages: {} as Messages,
    },
    scrollRestoration: true,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
