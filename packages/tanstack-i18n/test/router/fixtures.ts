import type { DeLocalizedTo } from "../../src/router/route-tree-types.js";

/** Consumer-style routeTree.gen `to` union for default `{-$locale}` file routes. */
export type FixtureRouteTo =
  | "/{-$locale}"
  | "/{-$locale}/auth"
  | "/{-$locale}/auth/signup"
  | "/{-$locale}/i18n-test"
  | "/{-$locale}/settings/profile";

/** Expected de-localized paths derived from {@link FixtureRouteTo}. */
export type FixtureDeLocalizedTo = DeLocalizedTo<FixtureRouteTo>;
