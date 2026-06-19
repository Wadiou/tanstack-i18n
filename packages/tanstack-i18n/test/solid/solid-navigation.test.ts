import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/solid-router", () => ({
  Link: () => null,
  useNavigate: () => vi.fn(),
  redirect: () => {
    throw new Error("Redirected");
  },
}));

import { defineLocaleConfig } from "../../src/config/define-locale.js";
import { createToLocalizedRoute } from "../../src/router/localized-route.js";
import { createNavigation as createSolidNavigation } from "../../src/solid/solid-navigation.js";
import { mockInfer, mockPersist } from "../helpers/mock-adapters.js";
import type { FixtureRouteTo } from "../router/fixtures.js";

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

describe("createNavigation (Solid)", () => {
  it("returns LocalizedLink, useLocalizedNavigate, and localizedRedirect", () => {
    const toLocalizedRoute = createToLocalizedRoute<FixtureRouteTo>(
      defaultFixtureConfig()
    );
    const nav = createSolidNavigation<FixtureRouteTo>({ toLocalizedRoute });

    expect(typeof nav.LocalizedLink).toBe("function");
    expect(typeof nav.useLocalizedNavigate).toBe("function");
    expect(typeof nav.localizedRedirect).toBe("function");
  });

  it("returns a new object per createSolidNavigation call", () => {
    const toLocalizedRoute = createToLocalizedRoute<FixtureRouteTo>(
      defaultFixtureConfig()
    );
    const a = createSolidNavigation<FixtureRouteTo>({ toLocalizedRoute });
    const b = createSolidNavigation<FixtureRouteTo>({ toLocalizedRoute });
    expect(a).not.toBe(b);
    expect(a.LocalizedLink).not.toBe(b.LocalizedLink);
  });
});
