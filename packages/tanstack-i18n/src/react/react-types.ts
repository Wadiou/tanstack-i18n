import type {
  LinkComponentProps,
  NavigateOptions,
  RedirectOptions,
  RegisteredRouter,
} from "@tanstack/react-router";
import type { DEFAULT_LOCALE_ROUTE_PREFIX_TYPE } from "../constants.js";
import type { DeLocalizedTo, ToRouteId } from "../router/route-tree-types.js";

/** TanStack Link props with de-localized `to`. */
export type LocalizedLinkProps<
  TTo extends DeLocalizedTo<RouteTreeTo, TLocalePrefix>,
  RouteTreeTo extends string,
  TLocalePrefix extends string = DEFAULT_LOCALE_ROUTE_PREFIX_TYPE,
> = Omit<
  LinkComponentProps<
    "a",
    RegisteredRouter,
    string,
    ToRouteId<TTo, TLocalePrefix>
  >,
  "to"
> & {
  /** De-localized path — mapped to localized route id at runtime. */
  to: TTo;
};

/** TanStack navigate options with de-localized `to`. */
export type LocalizedNavigateOptions<
  TTo extends DeLocalizedTo<RouteTreeTo, TLocalePrefix>,
  RouteTreeTo extends string,
  TLocalePrefix extends string = DEFAULT_LOCALE_ROUTE_PREFIX_TYPE,
> = Omit<
  NavigateOptions<RegisteredRouter, string, ToRouteId<TTo, TLocalePrefix>>,
  "to"
> & {
  /** De-localized path — mapped to localized route id at runtime. */
  to: TTo;
};

/** TanStack redirect options with de-localized `to`. */
export type LocalizedRedirectOptions<
  TTo extends DeLocalizedTo<RouteTreeTo, TLocalePrefix>,
  RouteTreeTo extends string,
  TLocalePrefix extends string = DEFAULT_LOCALE_ROUTE_PREFIX_TYPE,
> = Omit<
  RedirectOptions<RegisteredRouter, string, ToRouteId<TTo, TLocalePrefix>>,
  "to"
> & {
  /** De-localized path — mapped to localized route id at runtime. */
  to: TTo;
};
