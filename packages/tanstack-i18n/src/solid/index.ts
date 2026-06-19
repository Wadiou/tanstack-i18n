/** Solid adapter — createLocaleProvider. */

import { PACKAGE_SUBPATHS } from "../constants.js";

export type {
  CreateLocaleProviderDeps,
  LocaleContextValue,
} from "./locale-provider.js";
export { createLocaleProvider } from "./locale-provider.js";

/** Subpath export constant — {@link PACKAGE_SUBPATHS.solid}. */
export const SOLID_ENTRY = PACKAGE_SUBPATHS.solid;
