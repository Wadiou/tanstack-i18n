/** Package constants and error message helpers. */

/** npm package name — must match package.json `"name"`. */
export const PACKAGE_NAME = "@wadiou/tanstack-i18n" as const;

/** Subpath import map for framework adapter entry modules. */
export const PACKAGE_SUBPATHS = {
  /** `@wadiou/tanstack-i18n/react-router` — localized route ids and navigation. */
  reactRouter: `${PACKAGE_NAME}/react-router`,
  /** `@wadiou/tanstack-i18n/solid-router` — localized route ids and navigation. */
  solidRouter: `${PACKAGE_NAME}/solid-router`,
  /** `@wadiou/tanstack-i18n/react` — `createLocaleProvider`. */
  react: `${PACKAGE_NAME}/react`,
  /** `@wadiou/tanstack-i18n/react-start` — server entry wrapper and react helpers. */
  reactStart: `${PACKAGE_NAME}/react-start`,
  /** `@wadiou/tanstack-i18n/solid-start` — server entry wrapper and solid helpers. */
  solidStart: `${PACKAGE_NAME}/solid-start`,
  /** `@wadiou/tanstack-i18n/solid` — `createLocaleProvider`. */
  solid: `${PACKAGE_NAME}/solid`,
} as const;

/** TanStack Router `{-$locale}` token — default route-id segment in `defineLocaleConfig`. */
export const DEFAULT_LOCALE_SEGMENT = "{-$locale}" as const;

/** Default locale file-route prefix for routeTree `to` ids — `/${DEFAULT_LOCALE_SEGMENT}`. */
export const DEFAULT_LOCALE_ROUTE_PREFIX =
  `/${DEFAULT_LOCALE_SEGMENT}` as const;

/** Type alias for the default locale file-route prefix string literal. */
export type DEFAULT_LOCALE_ROUTE_PREFIX_TYPE =
  typeof DEFAULT_LOCALE_ROUTE_PREFIX;

/** HTTP 301 — canonical locale URL shape (strip default prefix or ignored path). */
export const CANONICAL_REDIRECT_STATUS = 301 as const;

/** HTTP 307 — first-visit and unprefixed redirect when status is omitted. */
export const LOCALE_REDIRECT_STATUS = 307 as const;

/** Default response header for detect action — overridable via `firstVisit.detectedLocaleHeader`. */
export const DEFAULT_DETECTED_LOCALE_HEADER = "X-Locale-Detected" as const;

/** Default HTTP pathname prefix mode when `url.prefix` is omitted in `defineLocaleConfig`. */
export const DEFAULT_URL_PREFIX = "as-needed" as const;

/** Default cookie name for `cookie` when `name` is omitted. */
export const DEFAULT_COOKIE_NAME = "LOCALE" as const;

/** Default localStorage key for `localStorage` when `key` is omitted. */
export const DEFAULT_LOCAL_STORAGE_KEY = "LOCALE" as const;

/**
 * Formats thrown errors and dev messages as `` `${PACKAGE_NAME}: ${detail}` ``.
 *
 * @param detail - Human-readable error fragment
 */
export function packageErrorPrefix(detail: string): string {
  return `${PACKAGE_NAME}: ${detail}`;
}
