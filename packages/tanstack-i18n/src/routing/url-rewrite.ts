import {
  CANONICAL_REDIRECT_STATUS,
  LOCALE_REDIRECT_STATUS,
} from "../constants.js";
import type { Locale, LocaleConfig, LocaleRequestResult } from "../types.js";
import { type PathnameKind, PathParser } from "./path-parser.js";
import { isAsNeededPrefix, isNeverPrefix } from "./prefix-mode.js";

/** Routing — localize / deLocalize URLs and canonical redirects. */
export class UrlRewriter {
  /**
   * Strips the locale prefix from a URL pathname.
   * No-op when {@link PathParser.shouldIgnore}; otherwise detects segment via {@link PathParser.extractLocale}
   * and removes it with {@link PathParser.stripPrefix}.
   */
  static deLocalize(url: URL, config: LocaleConfig): URL {
    if (PathParser.shouldIgnore(url.pathname, config.url)) {
      return url;
    }

    const segment = PathParser.extractLocale(url.pathname, config.locales);
    if (segment) {
      const newUrl = new URL(url);
      newUrl.pathname = PathParser.stripPrefix(url.pathname, segment);
      return newUrl;
    }

    return url;
  }

  /**
   * Adds a locale prefix to a URL pathname per {@link LocaleConfig.url} prefix mode.
   * No-op for ignored paths, `never`, and `as-needed` when `activeLocale` is the default.
   * Per-locale prefix map uses the configured segment string instead of the locale code.
   */
  static localize(url: URL, activeLocale: Locale, config: LocaleConfig): URL {
    if (PathParser.shouldIgnore(url.pathname, config.url)) {
      return url;
    }

    const { prefix } = config.url;
    if (isNeverPrefix(prefix)) {
      return url;
    }

    // as-needed: default locale stays unprefixed
    if (isAsNeededPrefix(prefix) && activeLocale === config.defaultLocale) {
      return url;
    }

    const prefixPath =
      typeof prefix === "object"
        ? `/${prefix[activeLocale]}`
        : `/${activeLocale}`;

    const newUrl = new URL(url);
    newUrl.pathname =
      url.pathname === "/" ? prefixPath : `${prefixPath}${url.pathname}`;
    return newUrl;
  }

  /**
   * Compares url to {@link UrlRewriter.localize}(target) → pass | redirect | sync-cookie.
   */
  static resolveLocalizeAction(
    url: URL,
    target: Locale,
    persist: Locale | null,
    config: LocaleConfig
  ): LocaleRequestResult {
    const localized = UrlRewriter.localize(url, target, config);

    // 1. Pathname would change — redirect to localized URL
    if (localized.pathname !== url.pathname) {
      return {
        action: "redirect",
        redirectUrl: localized.toString(),
        locale: target,
        status: LOCALE_REDIRECT_STATUS,
      };
    }

    // 2. Persist already matches target — nothing to do
    if (persist === target) {
      return { action: "pass" };
    }

    // 3. as-needed + default target + no persist — unprefixed default is valid
    if (
      isAsNeededPrefix(config.url.prefix) &&
      target === config.defaultLocale &&
      persist === null
    ) {
      return { action: "pass" };
    }

    // 4. Same URL shape but persist miss — sync cookie without redirect
    return { action: "sync-cookie", locale: target };
  }

  /**
   * Returns a canonical redirect target for wrong prefix **shape** only, or null.
   *
   * **Prefixed**: strip when `never`, `as-needed` + default locale, or stripped path is ignored.
   *
   * **Unprefixed**: always null — add-prefix redirects use {@link UrlRewriter.resolveLocalizeAction} (307).
   */
  static resolvePrefixStripRedirect(
    url: URL,
    config: LocaleConfig,
    kind: Exclude<PathnameKind, "ignored">
  ): { redirectUrl: string; status: number; locale: Locale } | null {
    if (kind !== "prefixed") {
      return null;
    }

    const segment = PathParser.extractLocale(url.pathname, config.locales);
    if (!segment) {
      return null;
    }

    const stripped = PathParser.stripPrefix(url.pathname, segment);
    const { prefix } = config.url;
    // Strip when prefix mode forbids locale segment or stripped path is ignored
    const shouldStrip =
      isNeverPrefix(prefix) ||
      (isAsNeededPrefix(prefix) && segment === config.defaultLocale) ||
      PathParser.shouldIgnore(stripped, config.url);

    if (!shouldStrip) {
      return null;
    }

    const target = new URL(url);
    target.pathname = stripped;
    return {
      redirectUrl: target.toString(),
      status: CANONICAL_REDIRECT_STATUS,
      locale: segment,
    };
  }

  /**
   * Returns bound URL helpers for `LocaleRuntime`.
   * Optional `locale` on `localizeUrl` uses the URL segment, then {@link LocaleConfig.defaultLocale} — no persist read.
   */
  static createBound(config: LocaleConfig): {
    deLocalizeUrl(url: URL): URL;
    localizeUrl(url: URL, locale?: Locale): URL;
  } {
    return {
      deLocalizeUrl(url) {
        return UrlRewriter.deLocalize(url, config);
      },
      localizeUrl(url, locale?) {
        // Resolve active locale: explicit arg → URL segment → default
        const active =
          locale ??
          PathParser.resolveUrlLocale(url.pathname, config) ??
          config.defaultLocale;
        return UrlRewriter.localize(
          UrlRewriter.deLocalize(url, config),
          active,
          config
        );
      },
    };
  }
}
