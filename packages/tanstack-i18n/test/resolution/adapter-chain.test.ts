import { describe, expect, it, vi } from "vitest";
import { defineLocaleConfig } from "../../src/config/define-locale.js";
import { RunContextBuilder } from "../../src/context/run-context.js";
import { AdapterChain } from "../../src/resolution/adapter-chain.js";
import type { InferMatchContext } from "../../src/types.js";
import {
  mockInfer,
  mockInferContext,
  mockPersist,
  mockPersistContext,
  noopWrite,
  validLocaleConfig,
} from "../helpers/mock-adapters.js";
import { buildLocaleConfig } from "../helpers/process-request-matrix.js";

describe("AdapterChain.resolvePersistChain", () => {
  const base = validLocaleConfig();

  it("returns base persist when no rule matches", () => {
    const ctx = { pathname: "/auth", config: base };
    const persist = AdapterChain.resolvePersistChain(base.adapters, ctx);
    expect(persist).toBe(base.persist);
  });

  it("replaces persist chain when persist rule matches", () => {
    const replacement = [mockPersist("cookie:OTHER")];
    const locale = {
      ...base,
      adapters: {
        ...base.adapters,
        overrides: [
          {
            target: "persist" as const,
            match: ({ pathname }: { pathname: string }) =>
              pathname.startsWith("/tenant"),
            persist: replacement,
          },
        ],
      },
    };
    const ctx = { pathname: "/tenant/app", config: base };
    const persist = AdapterChain.resolvePersistChain(locale.adapters, ctx);
    expect(persist).toBe(replacement);
  });

  it("uses first matching persist rule only", () => {
    const first = [mockPersist("cookie:FIRST")];
    const second = [mockPersist("cookie:SECOND")];
    const locale = {
      ...base,
      adapters: {
        ...base.adapters,
        overrides: [
          {
            target: "persist" as const,
            match: () => true,
            persist: first,
          },
          {
            target: "persist" as const,
            match: () => true,
            persist: second,
          },
        ],
      },
    };
    const persist = AdapterChain.resolvePersistChain(locale.adapters, {
      pathname: "/",
      config: base,
    });
    expect(persist).toBe(first);
  });
});

describe("AdapterChain.resolveInferChain", () => {
  const base = validLocaleConfig();
  const request = new Request("https://example.com/auth");

  it("returns base infer when no rule matches", () => {
    const ctx = { request, pathname: "/auth", config: base };
    const infer = AdapterChain.resolveInferChain(base.adapters, ctx);
    expect(infer).toBe(base.infer);
  });

  it("replaces infer chain when infer rule matches", () => {
    const locale = {
      ...base,
      adapters: {
        ...base.adapters,
        overrides: [
          {
            target: "infer" as const,
            match: ({ pathname }: { pathname: string }) =>
              pathname.startsWith("/auth"),
            infer: [],
          },
        ],
      },
    };
    const ctx = { request, pathname: "/auth", config: base };
    const infer = AdapterChain.resolveInferChain(locale.adapters, ctx);
    expect(infer).toEqual([]);
  });

  it("replaces infer with custom adapters", () => {
    const customInfer = [mockInfer("header:geo")];
    const locale = {
      ...base,
      adapters: {
        ...base.adapters,
        overrides: [
          {
            target: "infer" as const,
            match: () => true,
            infer: customInfer,
          },
        ],
      },
    };
    const infer = AdapterChain.resolveInferChain(locale.adapters, {
      request,
      pathname: "/",
      config: base,
    });
    expect(infer).toBe(customInfer);
  });
});

describe("AdapterChain.resolveFirstVisitConfig", () => {
  const base = defineLocaleConfig({
    locales: ["en", "ar"] as const,
    defaultLocale: "en" as const,
    url: { prefix: "as-needed" as const },
    firstVisit: {
      mode: "redirect",
      detectedLocaleHeader: "X-Locale-Detected",
    },
    adapters: {
      persist: [mockPersist("cookie:LOCALE")],
      infer: [mockInfer("accept-language")],
    },
  });

  it("returns global firstVisit when no override matches", () => {
    const request = new Request("https://example.com/");
    const firstVisit = AdapterChain.resolveFirstVisitConfig(
      base.adapters,
      base,
      { request, pathname: "/", config: base }
    );
    expect(firstVisit).toEqual(base.firstVisit);
  });

  it("merges partial firstVisit override when rule matches", () => {
    const locale = defineLocaleConfig({
      ...base,
      adapters: {
        ...base.adapters,
        overrides: [
          {
            target: "firstVisit" as const,
            match: ({ pathname }: InferMatchContext) =>
              pathname.startsWith("/auth"),
            firstVisit: { mode: "detect" as const },
          },
        ],
      },
    });
    const request = new Request("https://example.com/auth/login");
    const firstVisit = AdapterChain.resolveFirstVisitConfig(
      locale.adapters,
      locale,
      { request, pathname: "/auth/login", config: locale }
    );
    expect(firstVisit).toEqual({
      mode: "detect",
      detectedLocaleHeader: "X-Locale-Detected",
    });
  });

  it("uses first matching firstVisit override only", () => {
    const locale = defineLocaleConfig({
      ...base,
      adapters: {
        ...base.adapters,
        overrides: [
          {
            target: "firstVisit" as const,
            match: () => true,
            firstVisit: {
              mode: "detect" as const,
              detectedLocaleHeader: "X-First",
            },
          },
          {
            target: "firstVisit" as const,
            match: () => true,
            firstVisit: {
              mode: "redirect" as const,
              detectedLocaleHeader: "X-Second",
            },
          },
        ],
      },
    });
    const request = new Request("https://example.com/auth");
    const firstVisit = AdapterChain.resolveFirstVisitConfig(
      locale.adapters,
      locale,
      { request, pathname: "/auth", config: locale }
    );
    expect(firstVisit.detectedLocaleHeader).toBe("X-First");
    expect(firstVisit.mode).toBe("detect");
  });
});

describe("AdapterChain.resolveEffective", () => {
  const base = validLocaleConfig();
  const request = new Request("https://example.com/auth");

  it("applies persist overrides but not infer overrides without request arg", () => {
    const replacement = [mockPersist("cookie:TENANT")];
    const locale = {
      ...base,
      adapters: {
        ...base.adapters,
        overrides: [
          {
            target: "persist" as const,
            match: () => true,
            persist: replacement,
          },
          {
            target: "infer" as const,
            match: () => true,
            infer: [],
          },
        ],
      },
    };
    const effective = AdapterChain.resolveEffective(locale.adapters, base, {
      pathname: "/dashboard",
      config: base,
    });
    expect(effective.persist).toBe(replacement);
    expect(effective.infer).toBe(base.infer);
  });

  it("applies both persist and infer overrides when request arg provided", () => {
    const replacement = [mockPersist("cookie:OTHER")];
    const locale = {
      ...base,
      adapters: {
        ...base.adapters,
        overrides: [
          {
            target: "persist" as const,
            match: () => true,
            persist: replacement,
          },
          {
            target: "infer" as const,
            match: () => true,
            infer: [],
          },
        ],
      },
    };
    const effective = AdapterChain.resolveEffective(
      locale.adapters,
      base,
      { pathname: "/auth", config: base },
      { request, pathname: "/auth", config: base }
    );
    expect(effective.persist).toBe(replacement);
    expect(effective.infer).toEqual([]);
  });
});

describe("AdapterChain.resolveTarget", () => {
  const baseConfig = buildLocaleConfig("as-needed");

  it("returns persist when cookie is set", async () => {
    const request = new Request("http://localhost/auth", {
      headers: { cookie: "LOCALE=ar" },
    });
    const config = AdapterChain.resolveEffective(
      baseConfig.adapters,
      baseConfig,
      { pathname: "/auth", config: baseConfig },
      { request, pathname: "/auth", config: baseConfig }
    );
    const persistCtx = RunContextBuilder.buildPersist({
      runtime: "server",
      pathname: "/auth",
      config,
      request,
    });
    const inferCtx = mockInferContext({ request });

    const result = await AdapterChain.resolveTarget(
      request,
      persistCtx,
      inferCtx,
      config
    );

    expect(result).toEqual({ target: "ar", persist: "ar" });
  });

  it("infers locale on GET when persist is null", async () => {
    const request = new Request("http://localhost/auth", {
      headers: { "accept-language": "ar" },
    });
    const config = AdapterChain.resolveEffective(
      baseConfig.adapters,
      baseConfig,
      { pathname: "/auth", config: baseConfig },
      { request, pathname: "/auth", config: baseConfig }
    );
    const persistCtx = mockPersistContext({ request });
    const inferCtx = mockInferContext({ request });

    const result = await AdapterChain.resolveTarget(
      request,
      persistCtx,
      inferCtx,
      config
    );

    expect(result).toEqual({ target: "ar", persist: null });
  });

  it("skips infer on POST and uses defaultLocale", async () => {
    const request = new Request("http://localhost/auth", {
      method: "POST",
      headers: { "accept-language": "ar" },
    });
    const config = AdapterChain.resolveEffective(
      baseConfig.adapters,
      baseConfig,
      { pathname: "/auth", config: baseConfig },
      { request, pathname: "/auth", config: baseConfig }
    );
    const persistCtx = mockPersistContext({ request });
    const inferCtx = mockInferContext({ request });

    const result = await AdapterChain.resolveTarget(
      request,
      persistCtx,
      inferCtx,
      config
    );

    expect(result).toEqual({ target: "en", persist: null });
  });

  it("respects infer override empty chain (D11)", async () => {
    const request = new Request("http://localhost/auth", {
      headers: { "accept-language": "ar" },
    });
    const overrideConfig = defineLocaleConfig({
      locales: baseConfig.locales,
      defaultLocale: baseConfig.defaultLocale,
      url: baseConfig.url,
      adapters: {
        persist: baseConfig.persist,
        infer: baseConfig.infer,
        overrides: [
          {
            target: "infer" as const,
            match: ({ pathname }: InferMatchContext) =>
              pathname.startsWith("/auth"),
            infer: [],
          },
        ],
      },
    });
    const config = AdapterChain.resolveEffective(
      overrideConfig.adapters,
      overrideConfig,
      { pathname: "/auth", config: overrideConfig },
      { request, pathname: "/auth", config: overrideConfig }
    );
    const persistCtx = mockPersistContext({ request });
    const inferCtx = mockInferContext({ request });

    const result = await AdapterChain.resolveTarget(
      request,
      persistCtx,
      inferCtx,
      config
    );

    expect(result).toEqual({ target: "en", persist: null });
  });
});

describe("AdapterChain.writePersist", () => {
  it("runs adapters in declaration order", async () => {
    const order: string[] = [];
    const adapters = [mockPersist("first"), mockPersist("second")].map(
      (adapter, index) => ({
        ...adapter,
        write: () => {
          order.push(index === 0 ? "first" : "second");
          return Promise.resolve();
        },
      })
    );
    const ctx = mockPersistContext();

    await AdapterChain.writePersist(adapters, "ar", ctx);

    expect(order).toEqual(["first", "second"]);
  });

  it("stops and throws when an adapter write fails", async () => {
    const secondWrite = vi.fn(noopWrite);
    const adapters = [
      {
        ...mockPersist("first"),
        write: () => {
          throw new Error("write failed");
        },
      },
      {
        ...mockPersist("second"),
        write: secondWrite,
      },
    ];
    const ctx = mockPersistContext();

    await expect(
      AdapterChain.writePersist(adapters, "ar", ctx)
    ).rejects.toThrow("write failed");
    expect(secondWrite).not.toHaveBeenCalled();
  });
});
