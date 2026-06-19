/** LocalizedLink, useLocalizedNavigate, localizedRedirect — de-localized `to` props. */

import { Link, redirect, useNavigate } from "@tanstack/react-router";
import React, { type JSX, useCallback } from "react";

import type { DEFAULT_LOCALE_ROUTE_PREFIX_TYPE } from "../constants.js";
import type { DeLocalizedTo } from "../router/route-tree-types.js";
import type {
  LocalizedLinkProps,
  LocalizedNavigateOptions,
  LocalizedRedirectOptions,
} from "./react-types.js";

/**
 * Creates localized navigation helpers bound to `createToLocalizedRoute`.
 * Wraps TanStack Router `Link`, `useNavigate`, and `redirect` with de-localized `to`.
 *
 * @param options.toLocalizedRoute - Maps de-localized paths to route tree ids
 * @returns `{ LocalizedLink, useLocalizedNavigate, localizedRedirect }`
 */
export function createNavigation<
  RouteTreeTo extends string,
  TLocalePrefix extends string = DEFAULT_LOCALE_ROUTE_PREFIX_TYPE,
>(options: {
  toLocalizedRoute: (
    to: DeLocalizedTo<RouteTreeTo, TLocalePrefix>
  ) => RouteTreeTo;
}): {
  LocalizedLink: <TTo extends DeLocalizedTo<RouteTreeTo, TLocalePrefix>>(
    props: LocalizedLinkProps<TTo, RouteTreeTo, TLocalePrefix>
  ) => JSX.Element;
  useLocalizedNavigate: () => <
    TTo extends DeLocalizedTo<RouteTreeTo, TLocalePrefix>,
  >(
    opts: LocalizedNavigateOptions<TTo, RouteTreeTo, TLocalePrefix>
  ) => void;
  localizedRedirect: <TTo extends DeLocalizedTo<RouteTreeTo, TLocalePrefix>>(
    opts: LocalizedRedirectOptions<TTo, RouteTreeTo, TLocalePrefix>
  ) => never;
} {
  const { toLocalizedRoute } = options;

  /** Link with de-localized `to` — mapped through `createToLocalizedRoute`. */
  function LocalizedLink<TTo extends DeLocalizedTo<RouteTreeTo, TLocalePrefix>>(
    props: LocalizedLinkProps<TTo, RouteTreeTo, TLocalePrefix>
  ) {
    const TypedLink = Link as unknown as React.FC<
      LocalizedLinkProps<TTo, RouteTreeTo, TLocalePrefix>
    >;

    return (
      <TypedLink {...props} to={toLocalizedRoute(props.to) as unknown as TTo} />
    );
  }

  /** Navigate hook — accepts de-localized `to`, maps before `useNavigate`. */
  function useLocalizedNavigate() {
    const navigate = useNavigate();

    return useCallback(
      <TTo extends DeLocalizedTo<RouteTreeTo, TLocalePrefix>>(
        opts: LocalizedNavigateOptions<TTo, RouteTreeTo, TLocalePrefix>
      ) => {
        const TypedNavigate = navigate as unknown as (
          options: LocalizedNavigateOptions<TTo, RouteTreeTo, TLocalePrefix>
        ) => void;

        const { to, ...rest } = opts;

        TypedNavigate({
          ...rest,
          to: toLocalizedRoute(to) as unknown as TTo,
        } as LocalizedNavigateOptions<TTo, RouteTreeTo, TLocalePrefix>);
      },
      [navigate]
    );
  }

  /** Route loader redirect with de-localized `to`. */
  function localizedRedirect<
    TTo extends DeLocalizedTo<RouteTreeTo, TLocalePrefix>,
  >(opts: LocalizedRedirectOptions<TTo, RouteTreeTo, TLocalePrefix>): never {
    const TypedRedirect = redirect as unknown as (
      options: LocalizedRedirectOptions<TTo, RouteTreeTo, TLocalePrefix>
    ) => never;

    const { to, ...rest } = opts;

    throw TypedRedirect({
      ...rest,
      to: toLocalizedRoute(to) as unknown as TTo,
    } as LocalizedRedirectOptions<TTo, RouteTreeTo, TLocalePrefix>);
  }

  return { LocalizedLink, useLocalizedNavigate, localizedRedirect };
}
