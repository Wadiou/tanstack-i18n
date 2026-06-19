import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  isValidLocale,
  LOCALE_TEXT_DIRECTION,
  type SupportedLocale,
} from "@/constants/locales";
import { LocaleProvider } from "@/i18n/provider";
import { useLocale } from "@/i18n/use-locale";
import { getLocale } from "@/locale";
import { setLocale } from "@/paraglide/runtime";
import appCss from "@/styles.css?url";

const EXAMPLE_NAME = "react-start-paraglide";

export interface RouterContext {
  locale: SupportedLocale;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const active = await getLocale();
    if (!isValidLocale(active)) {
      throw new Error(`Unsupported locale: ${active}`);
    }
    setLocale(active);
    return { locale: active };
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
  const activeLocale = useLocale();

  return (
    <RootDocument locale={activeLocale}>
      <LocaleProvider>
        <Outlet />
        <footer className="example-footer">Example: {EXAMPLE_NAME}</footer>
      </LocaleProvider>
    </RootDocument>
  );
}
