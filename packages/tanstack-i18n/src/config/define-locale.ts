/** config — defineLocaleConfig normalization. */
import { cookie } from "../adapters/cookie-adapter.js";
import {
  DEFAULT_DETECTED_LOCALE_HEADER,
  DEFAULT_LOCALE_SEGMENT,
  DEFAULT_URL_PREFIX,
} from "../constants.js";
import type { DefineLocaleInput, LocaleConfig } from "../types.js";
import { LocaleConfigValidator } from "./locale-config-validator.js";

/**
 * Builds a validated {@link LocaleConfig}. Validates input only — no request I/O.
 *
 * Normalizes:
 * - `firstVisit` — default `{ mode: "redirect", detectedLocaleHeader }`
 * - `url.prefix` — default `"as-needed"`; `url.segment` — default `{-$locale}`
 * - `adapters.persist` — default `[cookie()]`; `adapters.infer` — default `[]`
 * - top-level `persist` / `infer` mirrors for convenience
 *
 * @param config - Raw locale configuration from the app
 * @returns Validated, normalized {@link LocaleConfig}
 *
 * @example
 * defineLocaleConfig({
 *   locales: ['en', 'fr'],
 *   defaultLocale: 'en',
 *   adapters: { infer: [acceptLanguage()] },
 * })
 */
export function defineLocaleConfig<const T extends DefineLocaleInput>(
  config: T
): LocaleConfig<T> {
  LocaleConfigValidator.validateInput(config);

  const adaptersIn = config.adapters ?? {};
  const persist = adaptersIn.persist ?? [cookie()];
  const infer = adaptersIn.infer ?? [];
  const urlInput = config.url ?? {};

  const normalized: LocaleConfig<T> = Object.freeze({
    locales: config.locales,
    defaultLocale: config.defaultLocale,
    firstVisit: Object.freeze({
      mode: "redirect",
      detectedLocaleHeader: DEFAULT_DETECTED_LOCALE_HEADER,
      ...config.firstVisit,
    }),
    adapters: Object.freeze({
      persist,
      infer,
      overrides: adaptersIn.overrides,
    }),
    persist,
    infer,
    url: Object.freeze({
      prefix: DEFAULT_URL_PREFIX,
      segment: DEFAULT_LOCALE_SEGMENT,
      ...urlInput,
    }),
  }) as LocaleConfig<T>;

  return normalized;
}
