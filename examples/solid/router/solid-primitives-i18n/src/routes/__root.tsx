import { createRootRouteWithContext, Outlet } from "@tanstack/solid-router";
import {
  isValidLocale,
  LOCALE_TEXT_DIRECTION,
  type SupportedLocale,
} from "@/constants/locales";
import { loadMessages } from "@/i18n/load-messages";
import { LocaleProvider } from "@/i18n/provider";
import { getLocale } from "@/locale";

const EXAMPLE_NAME = "solid-router-solid-primitives-i18n";

export interface RouterContext {
  locale: SupportedLocale;
  messages: Record<string, string>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const active = await getLocale();
    if (!isValidLocale(active)) {
      throw new Error(`Unsupported locale: ${active}`);
    }
    const messages = await loadMessages(active);
    document.documentElement.setAttribute("lang", active);
    document.documentElement.setAttribute("dir", LOCALE_TEXT_DIRECTION[active]);
    return { locale: active, messages };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <LocaleProvider>
      <Outlet />
      <footer class="example-footer">Example: {EXAMPLE_NAME}</footer>
    </LocaleProvider>
  );
}
