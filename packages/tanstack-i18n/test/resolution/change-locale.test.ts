import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cookie } from "../../src/adapters/index.js";
import { defineLocaleConfig } from "../../src/config/define-locale.js";
import { createLocaleRuntime } from "../../src/create-locale-runtime.js";
import { LocaleRuntimeError } from "../../src/errors.js";
import { ignoredPathsRegex, noopWrite } from "../helpers/mock-adapters.js";

const changeLocaleRequiresBrowserRegex =
  /changeLocale requires a browser environment/;

function mockBrowserLocation(pathname: string, search = "", hash = "") {
  const href = `https://example.com${pathname}${search}${hash}`;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: { pathname, search, hash, href },
      history: globalThis.history,
    },
  });
  return href;
}

describe("changeLocale via createLocaleRuntime", () => {
  const originalWindow = globalThis.window;
  let replaceState: ReturnType<typeof vi.fn>;
  let invalidate: ReturnType<typeof vi.fn<() => Promise<void>>>;

  beforeEach(() => {
    replaceState = vi.fn();
    invalidate = vi.fn<() => Promise<void>>(noopWrite);
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

  it("throws when window is undefined", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: undefined,
    });
    const runtime = createLocaleRuntime(
      defineLocaleConfig({
        locales: ["en", "ar"] as const,
        defaultLocale: "en" as const,
        url: { prefix: "as-needed" as const },
        adapters: { persist: [cookie({ name: "LOCALE" })] },
      })
    );

    await expect(
      runtime.changeLocale("ar", { router: { invalidate } })
    ).rejects.toThrow(LocaleRuntimeError);
    await expect(
      runtime.changeLocale("ar", { router: { invalidate } })
    ).rejects.toThrow(changeLocaleRequiresBrowserRegex);
  });

  it("no-ops when next locale equals getLocale", async () => {
    mockBrowserLocation("/auth");
    const write = vi.fn(noopWrite);
    const runtime = createLocaleRuntime(
      defineLocaleConfig({
        locales: ["en", "ar"] as const,
        defaultLocale: "en" as const,
        url: { prefix: "as-needed" as const },
        adapters: {
          persist: [{ id: "test", read: async () => "en", write }],
        },
      })
    );

    await runtime.changeLocale("en", { router: { invalidate } });

    expect(write).not.toHaveBeenCalled();
    expect(replaceState).not.toHaveBeenCalled();
    expect(invalidate).not.toHaveBeenCalled();
  });

  it("writes persist chain and updates URL on public path", async () => {
    mockBrowserLocation("/auth");
    const write = vi.fn(noopWrite);
    const runtime = createLocaleRuntime(
      defineLocaleConfig({
        locales: ["en", "ar"] as const,
        defaultLocale: "en" as const,
        url: { prefix: "as-needed" as const },
        adapters: {
          persist: [{ id: "test", read: async () => "en", write }],
        },
      })
    );

    await runtime.changeLocale("ar", { router: { invalidate } });

    expect(write).toHaveBeenCalledOnce();
    expect(replaceState).toHaveBeenCalledWith(null, "", "/ar/auth");
    expect(invalidate).toHaveBeenCalledOnce();
  });

  it("skips URL update on ignored paths", async () => {
    mockBrowserLocation("/dashboard/todos");
    const write = vi.fn(noopWrite);
    const runtime = createLocaleRuntime(
      defineLocaleConfig({
        locales: ["en", "ar"] as const,
        defaultLocale: "en" as const,
        url: {
          prefix: "as-needed" as const,
          ignoredPaths: ignoredPathsRegex,
        },
        adapters: {
          persist: [{ id: "test", read: async () => "en", write }],
        },
      })
    );

    await runtime.changeLocale("ar", { router: { invalidate } });

    expect(write).toHaveBeenCalledOnce();
    expect(replaceState).not.toHaveBeenCalled();
    expect(invalidate).toHaveBeenCalledOnce();
  });

  it("propagates write failure and skips router invalidate", async () => {
    mockBrowserLocation("/auth");
    const invalidateAfterFailure = vi.fn(noopWrite);
    const runtime = createLocaleRuntime(
      defineLocaleConfig({
        locales: ["en", "ar"] as const,
        defaultLocale: "en" as const,
        url: { prefix: "as-needed" as const },
        adapters: {
          persist: [
            {
              id: "test",
              read: async () => "en",
              write: () => {
                throw new Error("persist write failed");
              },
            },
          ],
        },
      })
    );

    await expect(
      runtime.changeLocale("ar", {
        router: { invalidate: invalidateAfterFailure },
      })
    ).rejects.toThrow("persist write failed");
    expect(invalidateAfterFailure).not.toHaveBeenCalled();
  });
});
