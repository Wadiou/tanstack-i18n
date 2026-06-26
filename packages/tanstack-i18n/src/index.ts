/**
 * @packageDocumentation
 * @wadiou/tanstack-i18n — locale routing for TanStack apps.
 *
 * Main entry points:
 * - {@link defineLocaleConfig} — {@link LocaleConfig}
 * - {@link createLocaleRuntime} — {@link LocaleRuntime} handlers
 * - `cookie`, `acceptLanguage`, `serverFn` — adapter factories
 *
 * Subpaths: `@wadiou/tanstack-i18n/react`, `/solid`, `/react-router`, `/solid-router`, `/react-start`, `/solid-start`.
 */

export { defineLocaleConfig } from "./config/define-locale.js";
export {
  DEFAULT_COOKIE_NAME,
  DEFAULT_DETECTED_LOCALE_HEADER,
  DEFAULT_URL_PREFIX,
  PACKAGE_NAME,
} from "./constants.js";
export { createLocaleRuntime } from "./create-locale-runtime.js";
export { LocaleConfigError, LocaleRuntimeError } from "./errors.js";
export type {
  AdapterRule,
  DefineLocaleAdaptersInput,
  DefineLocaleInput,
  FetchHandler,
  FirstVisitConfig,
  FirstVisitMode,
  FirstVisitOverrideRule,
  InferAdapter,
  InferMatchContext,
  InferOverrideRule,
  InferRunContext,
  Locale,
  LocaleAdapters,
  LocaleConfig,
  LocalePrefix,
  LocaleReadContext,
  LocaleRequestResult,
  LocaleRuntime,
  LocaleUrlConfig,
  PersistAdapter,
  PersistMatchContext,
  PersistOverrideRule,
  PersistRunContext,
} from "./types.js";
