import { PACKAGE_SUBPATHS } from "../constants.js";

export { createToLocalizedRoute } from "../router/localized-route.js";
export type {
  DeLocalizedTo,
  LocalePrefixedRoutes,
  StripLocalePrefix,
  ToRouteId,
} from "../router/route-tree-types.js";
export { createNavigation } from "../solid/solid-navigation.js";
export type {
  LocalizedLinkProps,
  LocalizedNavigateOptions,
  LocalizedRedirectOptions,
} from "../solid/solid-types.js";

/** Subpath export constant — {@link PACKAGE_SUBPATHS.solidRouter}. */
export const SOLID_ROUTER_ENTRY = PACKAGE_SUBPATHS.solidRouter;
