import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { IntlProvider } from "use-intl";
import {
  isValidLocale,
  LOCALE_TEXT_DIRECTION,
  type SupportedLocale,
} from "@/constants/locales";
import { loadMessages } from "@/i18n/load-messages";
import { LocaleProvider } from "@/i18n/provider";
import { getLocale } from "@/locale";
import appCss from "@/styles.css?url";
import type { Messages } from "@/types/i18n";

const EXAMPLE_NAME = "react-start-use-intl";

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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: EXAMPLE_NAME },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootDocument({
  children,
  locale: activeLocale,
}: {
  children: ReactNode;
  locale: SupportedLocale;
}) {
  return (
    <html
      dir={LOCALE_TEXT_DIRECTION[activeLocale]}
      lang={activeLocale}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { locale: activeLocale, messages } = Route.useRouteContext();

  return (
    <RootDocument locale={activeLocale}>
      <IntlProvider locale={activeLocale} messages={messages} timeZone="UTC">
        <LocaleProvider>
          <Outlet />
          <footer className="example-footer">Example: {EXAMPLE_NAME}</footer>
        </LocaleProvider>
      </IntlProvider>
    </RootDocument>
  );
}
