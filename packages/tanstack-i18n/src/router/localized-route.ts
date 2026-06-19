/** Maps de-localized app paths to TanStack Router route ids. */

import {
  DEFAULT_LOCALE_ROUTE_PREFIX,
  type DEFAULT_LOCALE_ROUTE_PREFIX_TYPE,
  DEFAULT_LOCALE_SEGMENT,
} from "../constants.js";
import type { LocaleConfig } from "../types.js";
import type { DeLocalizedTo } from "./route-tree-types.js";

/**
 * Builds `(to) => routeId` from `config.url.segment` (default `{-$locale}`).
 *
 * @param config - Locale config slice with `LocaleUrlConfig.segment`
 * @returns Function mapping de-localized paths to localized route tree ids
 */
export function createToLocalizedRoute<
  RouteTreeTo extends string,
  TLocalePrefix extends string = DEFAULT_LOCALE_ROUTE_PREFIX_TYPE,
>(
  config: Pick<LocaleConfig, "url">
): (to: DeLocalizedTo<RouteTreeTo, TLocalePrefix>) => RouteTreeTo {
  const segment = config.url.segment ?? DEFAULT_LOCALE_SEGMENT;
  const prefix =
    segment === DEFAULT_LOCALE_SEGMENT
      ? DEFAULT_LOCALE_ROUTE_PREFIX
      : `/${segment}`;

  return (to: DeLocalizedTo<RouteTreeTo, TLocalePrefix>) => {
    if (to === "/") {
      return prefix as RouteTreeTo;
    }

    return `${prefix}${to}` as RouteTreeTo;
  };
}
