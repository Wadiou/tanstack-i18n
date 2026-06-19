import { assertType, expectTypeOf, test } from "vitest";

import type { DEFAULT_LOCALE_ROUTE_PREFIX_TYPE } from "../../src/constants.js";
import { createToLocalizedRoute } from "../../src/router/localized-route.js";
import type {
  DeLocalizedTo,
  ToRouteId,
} from "../../src/router/route-tree-types.js";
import type { FixtureDeLocalizedTo, FixtureRouteTo } from "./fixtures.js";

test("DeLocalizedTo strips default {-$locale} prefix", () => {
  expectTypeOf<FixtureDeLocalizedTo>().toEqualTypeOf<
    "/" | "/auth" | "/auth/signup" | "/i18n-test" | "/settings/profile"
  >();
});

test("valid public paths extend DeLocalizedTo", () => {
  expectTypeOf<"/">().toExtend<FixtureDeLocalizedTo>();
  expectTypeOf<"/auth">().toExtend<FixtureDeLocalizedTo>();
  expectTypeOf<"/settings/profile">().toExtend<FixtureDeLocalizedTo>();
});

test("ToRouteId maps de-localized paths back to route ids", () => {
  expectTypeOf<
    ToRouteId<"/", DEFAULT_LOCALE_ROUTE_PREFIX_TYPE>
  >().toEqualTypeOf<"/{-$locale}">();

  expectTypeOf<
    ToRouteId<"/auth", DEFAULT_LOCALE_ROUTE_PREFIX_TYPE>
  >().toEqualTypeOf<"/{-$locale}/auth">();
});

test("createToLocalizedRoute accepts DeLocalizedTo and returns RouteTreeTo", () => {
  const map = createToLocalizedRoute<FixtureRouteTo>({
    url: { prefix: "as-needed" },
  });

  expectTypeOf(map).parameter(0).toEqualTypeOf<FixtureDeLocalizedTo>();
  expectTypeOf(map).returns.toEqualTypeOf<FixtureRouteTo>();
  expectTypeOf(map("/auth")).toEqualTypeOf<FixtureRouteTo>();
});

test("custom TLocalePrefix is forwarded through DeLocalizedTo", () => {
  type CustomTree = "/lang" | "/lang/auth";

  expectTypeOf<DeLocalizedTo<CustomTree, "/lang">>().toEqualTypeOf<
    "/" | "/auth"
  >();
});

test("rejects route ids and browser URLs as DeLocalizedTo input", () => {
  expectTypeOf<"/{-$locale}/auth">().not.toExtend<FixtureDeLocalizedTo>();
  expectTypeOf<"/ar/auth">().not.toExtend<FixtureDeLocalizedTo>();
  expectTypeOf<"/unknown">().not.toExtend<FixtureDeLocalizedTo>();

  // @ts-expect-error route id, not de-localized input
  assertType<FixtureDeLocalizedTo>("/{-$locale}/auth");
});
