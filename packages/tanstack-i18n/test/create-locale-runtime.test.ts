import { describe, expect, it, vi } from "vitest";
import { cookie } from "../src/adapters/index.js";
import { defineLocaleConfig } from "../src/config/define-locale.js";
import { createLocaleRuntime } from "../src/create-locale-runtime.js";
import { LocaleConfigError, LocaleRuntimeError } from "../src/errors.js";
import {
  validDefineLocaleInput,
  validLocaleConfig,
} from "./helpers/mock-adapters.js";

describe("createLocaleRuntime", () => {
  it("throws LocaleConfigError when bootstrap validation fails", () => {
    const bad = defineLocaleConfig({
      ...validDefineLocaleInput(),
      adapters: { persist: [], infer: [] },
    });
    expect(() => createLocaleRuntime(bad)).toThrow(LocaleConfigError);
  });

  it("returns runtime with config and all methods", () => {
    const locale = validLocaleConfig();
    const core = createLocaleRuntime(locale);

    expect(core.config).toBe(locale);
    expect(typeof core.getLocale).toBe("function");
    expect(typeof core.deLocalizeUrl).toBe("function");
    expect(typeof core.localizeUrl).toBe("function");
    expect(typeof core.changeLocale).toBe("function");
    expect(typeof core.createServerEntry).toBe("function");
  });

  it("getLocale resolves locale from request URL and persist chain", async () => {
    const locale = defineLocaleConfig({
      locales: ["en", "ar"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "as-needed" as const },
      adapters: { persist: [cookie({ name: "LOCALE" })] },
    });
    const core = createLocaleRuntime(locale);

    await expect(
      core.getLocale({
        request: new Request("https://example.com/auth", {
          headers: { cookie: "LOCALE=ar" },
        }),
      })
    ).resolves.toBe("ar");
  });

  it("throws on server when getLocale is called without context", async () => {
    const core = createLocaleRuntime(validLocaleConfig());

    await expect(core.getLocale()).rejects.toThrow(LocaleRuntimeError);
  });

  it("createServerEntry wraps a fetch handler", async () => {
    const locale = validLocaleConfig();
    const core = createLocaleRuntime(locale);
    const handler = vi.fn(async () => new Response("ok"));
    const fetch = core.createServerEntry(handler);

    const response = await fetch(new Request("https://example.com/auth"));

    expect(typeof fetch).toBe("function");
    expect(handler).toHaveBeenCalledOnce();
    expect(await response.text()).toBe("ok");
  });

  it("bound URL helpers do not throw for typical URLs", () => {
    const locale = validLocaleConfig();
    const core = createLocaleRuntime(locale);
    const url = new URL("https://example.com/ar/auth");

    expect(() => core.deLocalizeUrl(url).pathname).not.toThrow();
    expect(core.deLocalizeUrl(url).pathname).toBe("/auth");
    const deLocalized = core.deLocalizeUrl(url);
    expect(() => core.localizeUrl(deLocalized, "ar").pathname).not.toThrow();
    expect(core.localizeUrl(deLocalized, "ar").pathname).toBe("/ar/auth");
  });
});
