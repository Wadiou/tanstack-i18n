import { describe, expect, it } from "vitest";

import { defineLocaleConfig } from "../../src/config/define-locale.js";
import {
  DEFAULT_LOCALE_ROUTE_PREFIX,
  DEFAULT_LOCALE_SEGMENT,
} from "../../src/constants.js";
import { createNavigation as createReactNavigation } from "../../src/react/react-navigation.js";
import { createToLocalizedRoute } from "../../src/router/localized-route.js";

import type { LocaleConfig } from "../../src/types.js";
import { mockInfer, mockPersist } from "../helpers/mock-adapters.js";
import type { FixtureDeLocalizedTo, FixtureRouteTo } from "./fixtures.js";

function expectedRouteId(to: FixtureDeLocalizedTo): FixtureRouteTo {
  if (to === "/") {
    return DEFAULT_LOCALE_ROUTE_PREFIX as FixtureRouteTo;
  }

  return `${DEFAULT_LOCALE_ROUTE_PREFIX}${to}` as FixtureRouteTo;
}

function defaultFixtureConfig() {
  return defineLocaleConfig({
    locales: ["en", "ar"] as const,
    defaultLocale: "en" as const,
    url: { prefix: "as-needed" as const },
    adapters: {
      persist: [mockPersist("cookie:LOCALE")],
      infer: [mockInfer("accept-language")],
    },
  });
}

function urlOnlyConfig(
  url: Pick<LocaleConfig, "url">["url"]
): Pick<LocaleConfig, "url"> {
  return { url };
}

describe("DEFAULT_LOCALE_ROUTE_PREFIX", () => {
  it("matches the default file-route token prefix", () => {
    expect(DEFAULT_LOCALE_ROUTE_PREFIX).toBe(`/${DEFAULT_LOCALE_SEGMENT}`);
    expect(DEFAULT_LOCALE_ROUTE_PREFIX).toBe("/{-$locale}");
  });
});

describe("createToLocalizedRoute", () => {
  describe("default segment", () => {
    const toLocalizedRoute = createToLocalizedRoute<FixtureRouteTo>(
      defaultFixtureConfig()
    );

    it.each([
      "/",
      "/auth",
      "/auth/signup",
      "/i18n-test",
      "/settings/profile",
    ] as const)("maps %s", (to) => {
      expect(toLocalizedRoute(to)).toBe(expectedRouteId(to));
    });

    it("is stable across repeated calls", () => {
      expect(toLocalizedRoute("/auth")).toBe(expectedRouteId("/auth"));
      expect(toLocalizedRoute("/auth")).toBe(expectedRouteId("/auth"));
      expect(toLocalizedRoute("/")).toBe(expectedRouteId("/"));
    });

    it("accepts only the url slice from config", () => {
      const fromUrlOnly = createToLocalizedRoute<FixtureRouteTo>(
        urlOnlyConfig({ prefix: "as-needed" })
      );
      expect(fromUrlOnly("/auth")).toBe(expectedRouteId("/auth"));
    });

    it("treats explicit default segment like omitted segment", () => {
      const explicit = createToLocalizedRoute<FixtureRouteTo>(
        urlOnlyConfig({
          prefix: "as-needed",
          segment: DEFAULT_LOCALE_SEGMENT,
        })
      );
      expect(explicit("/")).toBe(expectedRouteId("/"));
      expect(explicit("/auth")).toBe(expectedRouteId("/auth"));
    });
  });

  describe("custom url.segment (runtime prefix)", () => {
    it.each([
      "lang",
      "locale",
    ] as const)("prefix follows segment %s", (segment) => {
      const toLocalizedRoute = createToLocalizedRoute<FixtureRouteTo>(
        urlOnlyConfig({ prefix: "as-needed", segment })
      );
      expect(toLocalizedRoute("/auth")).toBe(`/${segment}/auth`);
      expect(toLocalizedRoute("/")).toBe(`/${segment}`);
    });
  });

  describe("factory behavior", () => {
    it("returns a new function per createToLocalizedRoute call", () => {
      const config = defaultFixtureConfig();
      const a = createToLocalizedRoute<FixtureRouteTo>(config);
      const b = createToLocalizedRoute<FixtureRouteTo>(config);
      expect(a).not.toBe(b);
      expect(a("/auth")).toBe(b("/auth"));
    });

    it("does not mutate url config used for prefix", () => {
      const config = defaultFixtureConfig();
      const urlBefore = { ...config.url };
      const toLocalizedRoute = createToLocalizedRoute<FixtureRouteTo>(config);
      toLocalizedRoute("/auth");
      expect(config.url).toEqual(urlBefore);
    });

    it("ignores locales and adapters on the config object", () => {
      const heavy = defineLocaleConfig({
        locales: ["en", "ar", "de"] as const,
        defaultLocale: "ar" as const,
        url: { prefix: "always" as const },
        adapters: {
          persist: [mockPersist("cookie:LOCALE"), mockPersist("cookie:OTHER")],
          infer: [mockInfer("accept-language"), mockInfer("header:x-lang")],
        },
      });
      const minimal = urlOnlyConfig({ prefix: "always" });

      const fromHeavy = createToLocalizedRoute<FixtureRouteTo>(heavy);
      const fromMinimal = createToLocalizedRoute<FixtureRouteTo>(minimal);

      expect(fromHeavy("/settings/profile")).toBe(
        expectedRouteId("/settings/profile")
      );
      expect(fromMinimal("/settings/profile")).toBe(
        expectedRouteId("/settings/profile")
      );
    });
  });
});

describe("createNavigation (React)", () => {
  it("returns LocalizedLink, useLocalizedNavigate, and localizedRedirect", () => {
    const toLocalizedRoute = createToLocalizedRoute<FixtureRouteTo>(
      defaultFixtureConfig()
    );
    const nav = createReactNavigation<FixtureRouteTo>({ toLocalizedRoute });

    expect(typeof nav.LocalizedLink).toBe("function");
    expect(typeof nav.useLocalizedNavigate).toBe("function");
    expect(typeof nav.localizedRedirect).toBe("function");
  });

  it("returns a new object per createReactNavigation call", () => {
    const toLocalizedRoute = createToLocalizedRoute<FixtureRouteTo>(
      defaultFixtureConfig()
    );
    const a = createReactNavigation<FixtureRouteTo>({ toLocalizedRoute });
    const b = createReactNavigation<FixtureRouteTo>({ toLocalizedRoute });
    expect(a).not.toBe(b);
    expect(a.LocalizedLink).not.toBe(b.LocalizedLink);
  });

  it("accepts a custom toLocalizedRoute implementation", () => {
    const calls: FixtureDeLocalizedTo[] = [];
    const toLocalizedRoute = (to: FixtureDeLocalizedTo) => {
      calls.push(to);
      return expectedRouteId(to);
    };
    const nav = createReactNavigation<FixtureRouteTo>({ toLocalizedRoute });

    expect(nav).toMatchObject({
      LocalizedLink: expect.any(Function),
      useLocalizedNavigate: expect.any(Function),
      localizedRedirect: expect.any(Function),
    });
    expect(calls).toHaveLength(0);
  });

  it("works with createToLocalizedRoute from the same config", () => {
    const config = defaultFixtureConfig();
    const toLocalizedRoute = createToLocalizedRoute<FixtureRouteTo>(config);
    const nav = createReactNavigation<FixtureRouteTo>({ toLocalizedRoute });

    expect(toLocalizedRoute("/auth")).toBe(expectedRouteId("/auth"));
    expect(typeof nav.useLocalizedNavigate).toBe("function");
  });
});
