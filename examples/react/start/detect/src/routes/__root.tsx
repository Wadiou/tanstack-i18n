import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { IntlProvider } from "use-intl";
import {
  isValidLocale,
  LOCALE_TEXT_DIRECTION,
  type SupportedLocale,
} from "@/constants/locales";
import { loadMessages } from "@/i18n/load-messages";
import { LocaleProvider, useLocaleContext } from "@/i18n/provider";
import { getDetectedLocale, getLocale } from "@/locale";
import appCss from "@/styles.css?url";
import type { Messages } from "@/types/i18n";

const EXAMPLE_NAME = "react-start-detect";

export interface RouterContext {
  detectedLocale: SupportedLocale | null;
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

    const detectedLocale = getDetectedLocale();

    return { locale: active, messages, detectedLocale };
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

function LanguageBanner({
  detectedLocale,
}: {
  detectedLocale: SupportedLocale | null;
}) {
  const { setLocale } = useLocaleContext();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (detectedLocale) {
      setShow(true);
    }
  }, [detectedLocale]);

  if (!show) {
    return null;
  }
  if (!detectedLocale) {
    return null;
  }

  return (
    <div className="language-banner">
      <div className="banner-content">
        <span className="banner-icon">🌐</span>
        <p>
          {detectedLocale === "zh"
            ? "检测到您的浏览器首选语言为中文，是否切换？"
            : "We detected your browser language preference is English. Switch to English?"}
        </p>
      </div>
      <div className="banner-actions">
        <button
          className="switch-btn"
          onClick={async () => {
            await setLocale(detectedLocale);
            setShow(false);
          }}
          type="button"
        >
          {detectedLocale === "zh" ? "切换语言" : "Switch Language"}
        </button>
        <button
          className="dismiss-btn"
          onClick={() => setShow(false)}
          type="button"
        >
          {detectedLocale === "zh" ? "忽略" : "Ignore"}
        </button>
      </div>
    </div>
  );
}

function RootComponent() {
  const {
    locale: activeLocale,
    messages,
    detectedLocale,
  } = Route.useRouteContext();

  return (
    <RootDocument locale={activeLocale}>
      <IntlProvider locale={activeLocale} messages={messages} timeZone="UTC">
        <LocaleProvider>
          <LanguageBanner detectedLocale={detectedLocale} />
          <div className="app-container">
            <Outlet />
            <footer className="example-footer">Example: {EXAMPLE_NAME}</footer>
          </div>
        </LocaleProvider>
      </IntlProvider>
    </RootDocument>
  );
}
