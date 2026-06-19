import { createIsomorphicFn } from "@tanstack/solid-start";
import { getRequest } from "@tanstack/solid-start/server";
import { DEFAULT_DETECTED_LOCALE_HEADER } from "../constants.js";
import type { LocaleConfig, LocaleRuntime } from "../types.js";

/**
 * Creates TanStack Start isomorphic locale functions for Solid.
 *
 * @param runtime The configured LocaleRuntime instance.
 * @param config The LocaleConfig used to configure the runtime.
 * @returns An object containing `getLocale` and `getDetectedLocale` isomorphic functions.
 */
export function createStartLocaleHelpers<TLocale extends string = string>(
  runtime: LocaleRuntime<TLocale>,
  config: LocaleConfig
) {
  const getLocale = createIsomorphicFn()
    .server(() => runtime.getLocale({ request: getRequest() }))
    .client(() => runtime.getLocale());

  const getDetectedLocale = createIsomorphicFn()
    .server((): TLocale | null => {
      const headerVal = getRequest().headers.get(
        config.firstVisit?.detectedLocaleHeader ??
          DEFAULT_DETECTED_LOCALE_HEADER
      );
      if (headerVal) {
        return headerVal as TLocale;
      }
      return null;
    })
    .client(() => null);

  return { getLocale, getDetectedLocale };
}
