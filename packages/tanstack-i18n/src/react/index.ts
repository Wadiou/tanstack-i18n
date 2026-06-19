/** React adapter — createLocaleProvider. */

import { PACKAGE_SUBPATHS } from "../constants.js";

export type {
  CreateLocaleProviderDeps,
  LocaleContextValue,
} from "./locale-provider.js";
export { createLocaleProvider } from "./locale-provider.js";

/** Subpath export constant — {@link PACKAGE_SUBPATHS.react}. */
export const REACT_ENTRY = PACKAGE_SUBPATHS.react;
