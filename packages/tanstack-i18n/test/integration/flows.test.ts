import { isRedirect } from "@tanstack/react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineLocaleConfig } from "../../src/config/define-locale.js";
import { DEFAULT_LOCALE_ROUTE_PREFIX } from "../../src/constants.js";
import { createLocaleRuntime } from "../../src/create-locale-runtime.js";
import { createNavigation } from "../../src/react/react-navigation.js";
import { createToLocalizedRoute } from "../../src/router/localized-route.js";
import {
  createFlowRuntime,
  FLOW_BASE_URL,
  flowLocaleConfig,
  makeFlowRequest,
  runProcessRequest,
} from "../helpers/integration-flows.js";
import { noopWrite } from "../helpers/mock-adapters.js";
import type { FixtureRouteTo } from "../router/fixtures.js";

function mockBrowserLocation(pathname: string) {
  const href = `${FLOW_BASE_URL}${pathname}`;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: { pathname, search: "", hash: "", href },
      history: globalThis.history,
    },
  });
}

describe("locale navigation flows", () => {
  it("flow 1: Arabic first visit on /", async () => {
    const request = makeFlowRequest("/", { acceptLanguage: "ar" });

    const result = await runProcessRequest(request);
    expect(result).toEqual({
      action: "redirect",
      redirectUrl: `${FLOW_BASE_URL}/ar`,
      locale: "ar",
      status: 307,
    });
    if (result.action !== "redirect") {
      throw new Error("expected redirect");
    }

    const browserUrl = new URL(result.redirectUrl);
    const prefixedRequest = makeFlowRequest(browserUrl.pathname);
    const prefixedRuntime = createFlowRuntime(prefixedRequest);

    await expect(prefixedRuntime.getLocale()).resolves.toBe("ar");
    expect(prefixedRuntime.deLocalizeUrl(browserUrl).pathname).toBe("/");
  });

  it("flow 2: default locale first visit on /auth", async () => {
    const request = makeFlowRequest("/auth", {
      acceptLanguage: "en-US,en;q=0.9",
    });
    const runtime = createFlowRuntime(request);

    await expect(runProcessRequest(request)).resolves.toEqual({
      action: "pass",
    });
    await expect(runtime.getLocale()).resolves.toBe("en");
  });

  it("flow 3: dashboard uses cookie-only locale", async () => {
    const request = makeFlowRequest("/dashboard/todos", {
      cookie: "LOCALE=ar",
      acceptLanguage: "ar",
    });
    const runtime = createFlowRuntime(request);

    await expect(runProcessRequest(request)).resolves.toEqual({
      action: "pass",
    });
    await expect(runtime.getLocale()).resolves.toBe("ar");

    const dashboardUrl = new URL(`${FLOW_BASE_URL}/dashboard/todos`);
    expect(runtime.localizeUrl(dashboardUrl, "ar").pathname).toBe(
      "/dashboard/todos"
    );
    expect(runtime.deLocalizeUrl(dashboardUrl).pathname).toBe(
      "/dashboard/todos"
    );
  });

  it("flow 4: public language switch to Arabic", async () => {
    const request = makeFlowRequest("/auth");
    const runtime = createFlowRuntime(request);

    const switched = runtime.localizeUrl(
      new URL(`${FLOW_BASE_URL}/auth`),
      "ar"
    );
    expect(switched.pathname).toBe("/ar/auth");

    const prefixedRequest = makeFlowRequest("/ar/auth", {
      cookie: "LOCALE=ar",
    });
    const prefixedRuntime = createFlowRuntime(prefixedRequest);
    await expect(prefixedRuntime.getLocale()).resolves.toBe("ar");
  });

  it("flow 5: dashboard language switch keeps URL unprefixed", async () => {
    const request = makeFlowRequest("/dashboard/todos", {
      cookie: "LOCALE=ar",
    });
    const runtime = createFlowRuntime(request);

    await expect(runtime.getLocale()).resolves.toBe("ar");
    expect(
      runtime.localizeUrl(new URL(`${FLOW_BASE_URL}/dashboard/todos`), "ar")
        .pathname
    ).toBe("/dashboard/todos");
  });

  it("flow 6: auth guard target localizes via router + rewrite", () => {
    const config = flowLocaleConfig();
    const toLocalizedRoute = createToLocalizedRoute<FixtureRouteTo>(config);

    expect(toLocalizedRoute("/auth")).toBe(
      `${DEFAULT_LOCALE_ROUTE_PREFIX}/auth`
    );
    expect(
      createFlowRuntime(makeFlowRequest("/auth")).localizeUrl(
        new URL(`${FLOW_BASE_URL}/auth`),
        "ar"
      ).pathname
    ).toBe("/ar/auth");
  });
});

describe("examples", () => {
  it("example B: GET /ar/auth syncs cookie and deLocalizes", async () => {
    const request = makeFlowRequest("/ar/auth");
    const runtime = createFlowRuntime(request);

    await expect(runProcessRequest(request)).resolves.toEqual({
      action: "sync-cookie",
      locale: "ar",
    });

    const url = new URL(`${FLOW_BASE_URL}/ar/auth`);
    expect(runtime.deLocalizeUrl(url).pathname).toBe("/auth");
    await expect(runtime.getLocale()).resolves.toBe("ar");
  });

  it("example E: localizedRedirect maps de-localized to to route id", () => {
    const config = flowLocaleConfig();
    const toLocalizedRoute = createToLocalizedRoute<FixtureRouteTo>(config);
    const { localizedRedirect } = createNavigation({ toLocalizedRoute });

    try {
      localizedRedirect({ to: "/auth" });
      throw new Error("localizedRedirect must throw");
    } catch (error) {
      expect(isRedirect(error)).toBe(true);
      if (isRedirect(error)) {
        expect(error.options.to).toBe(`${DEFAULT_LOCALE_ROUTE_PREFIX}/auth`);
      }
    }
  });
});

describe("behavior deltas", () => {
  it("redirects unprefixed /auth when LOCALE=ar cookie exists (D3)", async () => {
    const request = makeFlowRequest("/auth", { cookie: "LOCALE=ar" });

    await expect(runProcessRequest(request)).resolves.toEqual({
      action: "redirect",
      redirectUrl: `${FLOW_BASE_URL}/ar/auth`,
      locale: "ar",
      status: 307,
    });
  });
});

describe("createServerEntry integration", () => {
  it("flow 1 maps to 307 + Set-Cookie via createServerEntry", async () => {
    const handler = vi.fn(async () => new Response("ok", { status: 200 }));
    const request = makeFlowRequest("/", { acceptLanguage: "ar" });
    const runtime = createFlowRuntime(request);
    const response = await runtime.createServerEntry(handler)(request);

    expect(handler).not.toHaveBeenCalled();
    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(`${FLOW_BASE_URL}/ar`);
    expect(response.headers.get("Set-Cookie")).toContain("LOCALE=ar");
  });
});

describe("changeLocale integration", () => {
  const originalWindow = globalThis.window;
  let replaceState: ReturnType<typeof vi.fn>;
  let invalidate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    replaceState = vi.fn();
    invalidate = vi.fn(noopWrite);
    Object.defineProperty(globalThis, "history", {
      configurable: true,
      value: { replaceState },
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    });
  });

  it("example F: changeLocale on /auth updates URL and invalidates router", async () => {
    mockBrowserLocation("/auth");
    const write = vi.fn(noopWrite);
    const base = flowLocaleConfig();
    const runtime = createLocaleRuntime(
      defineLocaleConfig({
        locales: base.locales,
        defaultLocale: base.defaultLocale,
        url: base.url,
        adapters: {
          persist: [{ id: "test", read: async () => "en", write }],
          infer: base.infer,
        },
      })
    );

    await runtime.changeLocale("ar", { router: { invalidate } });

    expect(write).toHaveBeenCalledOnce();
    expect(replaceState).toHaveBeenCalledWith(null, "", "/ar/auth");
    expect(invalidate).toHaveBeenCalledOnce();
  });
});
