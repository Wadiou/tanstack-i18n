import { Link, redirect, useNavigate } from "@tanstack/solid-router";
import type { Component, JSX } from "solid-js";
import { createComponent } from "solid-js";
import type { DEFAULT_LOCALE_ROUTE_PREFIX_TYPE } from "../constants.js";
import type { DeLocalizedTo } from "../router/route-tree-types.js";
import type {
  LocalizedLinkProps,
  LocalizedNavigateOptions,
  LocalizedRedirectOptions,
} from "./solid-types.js";

export function createNavigation<
  RouteTreeTo extends string,
  TLocalePrefix extends string = DEFAULT_LOCALE_ROUTE_PREFIX_TYPE,
>(options: {
  toLocalizedRoute: (
    to: DeLocalizedTo<RouteTreeTo, TLocalePrefix>
  ) => RouteTreeTo;
}) {
  const { toLocalizedRoute } = options;

  function LocalizedLink<TTo extends DeLocalizedTo<RouteTreeTo, TLocalePrefix>>(
    props: LocalizedLinkProps<TTo, RouteTreeTo, TLocalePrefix>
  ): JSX.Element {
    return createComponent(
      Link as unknown as Component<
        LocalizedLinkProps<TTo, RouteTreeTo, TLocalePrefix>
      >,
      {
        ...props,
        get to() {
          return toLocalizedRoute(props.to) as unknown as TTo;
        },
      }
    );
  }

  function useLocalizedNavigate() {
    const navigate = useNavigate();

    return <TTo extends DeLocalizedTo<RouteTreeTo, TLocalePrefix>>(
      opts: LocalizedNavigateOptions<TTo, RouteTreeTo, TLocalePrefix>
    ) => {
      const { to, ...rest } = opts;
      navigate({
        ...rest,
        to: toLocalizedRoute(to) as unknown as TTo,
      } as unknown as Parameters<typeof navigate>[0]);
    };
  }

  function localizedRedirect<
    TTo extends DeLocalizedTo<RouteTreeTo, TLocalePrefix>,
  >(opts: LocalizedRedirectOptions<TTo, RouteTreeTo, TLocalePrefix>): never {
    const { to, ...rest } = opts;
    throw redirect({
      ...rest,
      to: toLocalizedRoute(to) as unknown as TTo,
    } as unknown as Parameters<typeof redirect>[0]);
  }

  return { LocalizedLink, useLocalizedNavigate, localizedRedirect };
}
