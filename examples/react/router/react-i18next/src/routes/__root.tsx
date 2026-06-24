import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { createInstance, type Resource } from "i18next";
import { useMemo } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import {
  isValidLocale,
  LOCALE_TEXT_DIRECTION,
  type SupportedLocale,
} from "@/constants/locales";
import { loadMessages } from "@/i18n/load-messages";
import { LocaleProvider } from "@/i18n/provider";
import { getLocale } from "@/locale";
import type { Messages } from "@/types/i18n";

const EXAMPLE_NAME = "react-router-react-i18next";

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

  const i18n = useMemo(() => {
    const instance = createInstance();
    instance.use(initReactI18next).init({
      lng: activeLocale,
      resources: {
        [activeLocale]: messages,
      } as unknown as Resource,
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
    return instance;
  }, [activeLocale, messages]);

  return (
    <div dir={LOCALE_TEXT_DIRECTION[activeLocale]} lang={activeLocale}>
      <I18nextProvider i18n={i18n}>
        <LocaleProvider>
          <Outlet />
          <footer className="example-footer">Example: {EXAMPLE_NAME}</footer>
        </LocaleProvider>
      </I18nextProvider>
    </div>
  );
}
