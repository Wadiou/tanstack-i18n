import { PACKAGE_SUBPATHS } from "../constants.js";

export { createNavigation } from "../react/react-navigation.js";
export type {
  LocalizedLinkProps,
  LocalizedNavigateOptions,
  LocalizedRedirectOptions,
} from "../react/react-types.js";
export { createToLocalizedRoute } from "../router/localized-route.js";
export type {
  DeLocalizedTo,
  LocalePrefixedRoutes,
  StripLocalePrefix,
  ToRouteId,
} from "../router/route-tree-types.js";

/** Subpath export constant — {@link PACKAGE_SUBPATHS.reactRouter}. */
export const REACT_ROUTER_ENTRY = PACKAGE_SUBPATHS.reactRouter;
