import type { DEFAULT_LOCALE_ROUTE_PREFIX_TYPE } from "../constants.js";

/** Locale-folder routes extracted from the app's routeTree.gen `to` union. */
export type LocalePrefixedRoutes<
  RouteTreeTo extends string,
  TLocalePrefix extends string = DEFAULT_LOCALE_ROUTE_PREFIX_TYPE,
> = Extract<RouteTreeTo, TLocalePrefix | `${TLocalePrefix}${string}`>;

/** Strips the locale file-route prefix from a route id. */
export type StripLocalePrefix<
  T extends string,
  TLocalePrefix extends string = DEFAULT_LOCALE_ROUTE_PREFIX_TYPE,
> = T extends TLocalePrefix
  ? "/"
  : T extends `${TLocalePrefix}${infer Rest}`
    ? Rest
    : never;

/** De-localized public paths — derived from route tree, not a manual list. */
export type DeLocalizedTo<
  RouteTreeTo extends string,
  TLocalePrefix extends string = DEFAULT_LOCALE_ROUTE_PREFIX_TYPE,
> = StripLocalePrefix<
  LocalePrefixedRoutes<RouteTreeTo, TLocalePrefix>,
  TLocalePrefix
>;

/** Maps de-localized app input to TanStack route id. */
export type ToRouteId<
  T extends string,
  TLocalePrefix extends string = DEFAULT_LOCALE_ROUTE_PREFIX_TYPE,
> = T extends "/" ? TLocalePrefix : `${TLocalePrefix}${T & string}`;
