import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { IntlProvider } from "use-intl";
import {
  isValidLocale,
  LOCALE_TEXT_DIRECTION,
  type SupportedLocale,
} from "@/constants/locales";
import { loadMessages } from "@/i18n/load-messages";
import { LocaleProvider } from "@/i18n/provider";
import { getLocale } from "@/locale";
import type { Messages } from "@/types/i18n";

const EXAMPLE_NAME = "react-router-use-intl";

export interface RouterContext {
  locale: SupportedLocale;
  messages: Messages;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const active = await getLocale();
    if (!isValidLocale(active)) {
      throw new Error(`Unsupported locale: ${active}`);
    }
    const messages = await loadMessages(active);
    return { locale: active, messages };
  },
  component: RootComponent,
});

function RootComponent() {
  const { locale: activeLocale, messages } = Route.useRouteContext();

  return (
    <div dir={LOCALE_TEXT_DIRECTION[activeLocale]} lang={activeLocale}>
      <IntlProvider locale={activeLocale} messages={messages} timeZone="UTC">
        <LocaleProvider>
          <Outlet />
          <footer className="example-footer">Example: {EXAMPLE_NAME}</footer>
        </LocaleProvider>
      </IntlProvider>
    </div>
  );
}
