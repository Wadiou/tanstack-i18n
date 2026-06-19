import { hasLocale } from "../locale/locale-validator.js";
import type { Locale, LocaleConfig, LocaleUrlConfig } from "../types.js";
import { isAsNeededPrefix, isNeverPrefix } from "./prefix-mode.js";

/**
 * Pathname classification for routing and middleware.
 * - `ignored` — {@link PathParser.shouldIgnore} matched
 * - `prefixed` — valid locale segment via {@link PathParser.extractLocale}
 * - `unprefixed` — no locale segment (default-locale or missing prefix)
 */
export type PathnameKind = "ignored" | "prefixed" | "unprefixed";

/** Routing — pathname classification and locale segment extraction. */
export class PathParser {
  /**
   * Returns whether the pathname is excluded from locale routing.
   * Evaluates `url.ignoredPaths` as RegExp or callback before prefix logic runs.
   */
  static shouldIgnore(pathname: string, url: LocaleUrlConfig): boolean {
    const { ignoredPaths } = url;
    if (!ignoredPaths) {
      return false;
    }
    if (typeof ignoredPaths === "function") {
      return ignoredPaths(pathname);
    }
    return ignoredPaths.test(pathname);
  }

  /**
   * Reads the locale code from the HTTP pathname — first path segment when it is a configured locale (e.g. `/fr/auth` → `fr`).
   */
  static extractLocale(
    pathname: string,
    locales: readonly Locale[]
  ): Locale | null {
    const parts = pathname.split("/").filter(Boolean);
    const candidate = parts[0];
    if (!(candidate && hasLocale(candidate, locales))) {
      return null;
    }

    return candidate;
  }

  /**
   * Locale from URL when prefix mode allows URL-based resolution.
   * Returns null when {@link PathParser.shouldIgnore}, prefix is `never`,
   * or `as-needed` with the default locale (treated as unprefixed).
   *
   * @see {@link PathParser.extractLocale}
   */
  static resolveUrlLocale(
    pathname: string,
    config: LocaleConfig
  ): Locale | null {
    if (PathParser.shouldIgnore(pathname, config.url)) {
      return null;
    }

    if (isNeverPrefix(config.url.prefix)) {
      return null;
    }

    const segment = PathParser.extractLocale(pathname, config.locales);
    if (!segment) {
      return null;
    }

    // as-needed: default locale prefix is canonical stripped — treat as unprefixed
    if (
      isAsNeededPrefix(config.url.prefix) &&
      segment === config.defaultLocale
    ) {
      return null;
    }

    return segment;
  }

  /**
   * Maps a pathname to {@link PathnameKind} for middleware and redirect logic.
   * Order: ignored → prefixed (valid {@link PathParser.extractLocale}) → unprefixed.
   */
  static classify(pathname: string, config: LocaleConfig): PathnameKind {
    if (PathParser.shouldIgnore(pathname, config.url)) {
      return "ignored";
    }

    if (PathParser.extractLocale(pathname, config.locales)) {
      return "prefixed";
    }

    return "unprefixed";
  }

  /**
   * Removes the locale prefix from a pathname — inverse of {@link PathParser.extractLocale}.
   * Strips `/${locale}`; empty remainder normalizes to `/`.
   */
  static stripPrefix(pathname: string, locale: Locale): string {
    const stripped = pathname.replace(`/${locale}`, "");
    return stripped === "" ? "/" : stripped;
  }
}
