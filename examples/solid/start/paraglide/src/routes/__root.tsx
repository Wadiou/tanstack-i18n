import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/solid-router";
import type { JSX } from "solid-js";
import { Suspense } from "solid-js";
import { HydrationScript } from "solid-js/web";
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

const EXAMPLE_NAME = "solid-start-paraglide";

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
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  component: RootComponent,
});

function RootDocument(props: {
  children: JSX.Element;
  locale: SupportedLocale;
}) {
  return (
    <html dir={LOCALE_TEXT_DIRECTION[props.locale]} lang={props.locale}>
      <head>
        <HydrationScript />
      </head>
      <body>
        <HeadContent />
        <Suspense>{props.children}</Suspense>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <RootDocument locale={useLocale()}>
      <LocaleProvider>
        <Outlet />
        <footer class="example-footer">Example: {EXAMPLE_NAME}</footer>
      </LocaleProvider>
    </RootDocument>
  );
}
