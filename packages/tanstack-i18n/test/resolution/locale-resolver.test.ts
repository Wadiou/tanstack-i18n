import { describe, expect, it, vi } from "vitest";
import { cookie, serverFn } from "../../src/adapters/index.js";
import { defineLocaleConfig } from "../../src/config/define-locale.js";
import { RunContextBuilder } from "../../src/context/run-context.js";
import { LocaleRuntimeError } from "../../src/errors.js";
import { LocaleResolver } from "../../src/resolution/locale-resolver.js";
import type { PersistMatchContext } from "../../src/types.js";
import {
  asNeededLocaleConfig,
  dashboardPathRegex,
  ignoredPathsRegex,
  noopWrite,
} from "../helpers/mock-adapters.js";

function resolveAt(
  config: Parameters<typeof LocaleResolver.resolve>[0],
  pathname: string,
  cookieHeader = ""
) {
  return LocaleResolver.resolve(config, {
    request: new Request(`https://example.com${pathname}`, {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    }),
  });
}

describe("LocaleResolver.resolve", () => {
  const config = asNeededLocaleConfig();

  it.each([
    ["/ar/auth", "", "ar"],
    ["/ar/auth", "LOCALE=en", "ar"],
    ["/auth", "LOCALE=ar", "ar"],
    ["/auth", "", "en"],
    ["/dashboard/todos", "LOCALE=ar", "ar"],
    ["/dashboard/todos", "", "en"],
  ])("resolve(%s, %j) → %s", async (pathname, cookieHeader, expected) => {
    await expect(resolveAt(config, pathname, cookieHeader)).resolves.toBe(
      expected
    );
  });

  it("skips persist preparation when URL carries locale", async () => {
    const read = vi.fn(async () => "en");
    const locale = defineLocaleConfig({
      locales: ["en", "ar"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "as-needed" as const },
      adapters: {
        persist: [{ id: "test", read, write: noopWrite }],
      },
    });

    await expect(resolveAt(locale, "/ar/auth")).resolves.toBe("ar");
    expect(read).not.toHaveBeenCalled();
  });

  it("uses persist chain in array order", async () => {
    const readDb = vi.fn(async () => "ar");
    const locale = defineLocaleConfig({
      locales: ["en", "ar"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "as-needed" as const },
      adapters: {
        persist: [
          serverFn({ read: readDb, write: noopWrite }),
          cookie({ name: "LOCALE" }),
        ],
      },
    });

    await expect(resolveAt(locale, "/auth", "LOCALE=ar")).resolves.toBe("ar");
    expect(readDb).toHaveBeenCalledOnce();
  });

  it("falls back to cookie when serverFn returns null", async () => {
    const locale = defineLocaleConfig({
      locales: ["en", "ar"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "as-needed" as const },
      adapters: {
        persist: [
          serverFn({ read: async () => null, write: noopWrite }),
          cookie({ name: "LOCALE" }),
        ],
      },
    });

    await expect(resolveAt(locale, "/auth", "LOCALE=ar")).resolves.toBe("ar");
  });

  it("never runs infer adapters", async () => {
    const inferRead = vi.fn(() => "ar");
    const locale = defineLocaleConfig({
      locales: ["en", "ar"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "never" as const, ignoredPaths: ignoredPathsRegex },
      adapters: {
        persist: [cookie({ name: "LOCALE" })],
        infer: [{ id: "test-infer", read: inferRead }],
      },
    });

    await expect(resolveAt(locale, "/auth")).resolves.toBe("en");
    expect(inferRead).not.toHaveBeenCalled();
  });
});

describe("LocaleResolver.createBound", () => {
  it("resolves via request on server", async () => {
    const config = defineLocaleConfig({
      locales: ["en", "ar"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "as-needed" as const },
      adapters: { persist: [cookie({ name: "LOCALE" })] },
    });
    const getLocale = LocaleResolver.createBound(config);

    await expect(
      getLocale({
        request: new Request("https://example.com/ar/auth", {
          headers: { cookie: "LOCALE=en" },
        }),
      })
    ).resolves.toBe("ar");
  });

  it("throws on server without context", async () => {
    const getLocale = LocaleResolver.createBound(
      defineLocaleConfig({
        locales: ["en", "ar"] as const,
        defaultLocale: "en" as const,
        url: { prefix: "as-needed" as const },
        adapters: { persist: [cookie()] },
      })
    );

    await expect(getLocale()).rejects.toThrow(LocaleRuntimeError);
  });

  it("resolves tenant on ignored path via override rule", async () => {
    const locale = defineLocaleConfig({
      locales: ["en", "de"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "as-needed" as const, ignoredPaths: dashboardPathRegex },
      adapters: {
        persist: [cookie({ name: "LOCALE" })],
        infer: [],
        overrides: [
          {
            target: "persist" as const,
            match: ({ pathname }: PersistMatchContext) =>
              pathname.startsWith("/dashboard"),
            persist: [
              {
                id: "tenant",
                read: (ctx) =>
                  ctx.request?.headers.get("x-tenant-locale") ?? null,
                write: noopWrite,
              },
            ],
          },
        ],
      },
    });
    const getLocale = LocaleResolver.createBound(locale);

    await expect(
      getLocale({
        request: new Request("https://example.com/dashboard/todos", {
          headers: { "x-tenant-locale": "de" },
        }),
      })
    ).resolves.toBe("de");
  });
});

describe("RunContextBuilder.buildPersist", () => {
  it("reads cookie header from request on server", () => {
    const config = asNeededLocaleConfig();
    const request = new Request("https://example.com/auth", {
      headers: { cookie: "LOCALE=ar" },
    });

    const ctx = RunContextBuilder.buildPersist({
      runtime: "server",
      pathname: "/auth",
      config,
      request,
    });

    expect(ctx.cookieHeader).toBe("LOCALE=ar");
  });
});
