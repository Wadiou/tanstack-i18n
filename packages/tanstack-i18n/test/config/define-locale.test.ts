import { describe, expect, it } from "vitest";
import { defineLocaleConfig } from "../../src/config/define-locale.js";
import { LocaleConfigError } from "../../src/errors.js";
import { mockPersist } from "../helpers/mock-adapters.js";

describe("defineLocaleConfig", () => {
  it("throws when locales is empty", () => {
    expect(() =>
      defineLocaleConfig({
        locales: [],
        defaultLocale: "en",
        url: { prefix: "as-needed" },
        adapters: { persist: [mockPersist("cookie:LOCALE")] },
      })
    ).toThrow(LocaleConfigError);
    expect(() =>
      defineLocaleConfig({
        locales: [],
        defaultLocale: "en",
        url: { prefix: "as-needed" },
        adapters: { persist: [mockPersist("cookie:LOCALE")] },
      })
    ).toThrow("locales must be non-empty");
  });

  it("throws when defaultLocale is not in locales", () => {
    expect(() =>
      defineLocaleConfig({
        locales: ["en", "ar"],
        defaultLocale: "de",
        url: { prefix: "as-needed" },
        adapters: { persist: [mockPersist("cookie:LOCALE")] },
      })
    ).toThrow(LocaleConfigError);
    expect(() =>
      defineLocaleConfig({
        locales: ["en", "ar"],
        defaultLocale: "de",
        url: { prefix: "as-needed" },
        adapters: { persist: [mockPersist("cookie:LOCALE")] },
      })
    ).toThrow('defaultLocale "de" must be in locales');
  });

  it("normalizes infer to empty array and freezes config", () => {
    const locale = defineLocaleConfig({
      locales: ["en"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "as-needed" as const },
      adapters: { persist: [mockPersist("cookie:LOCALE")] },
    });
    expect(locale.infer).toEqual([]);
    expect(locale.adapters.infer).toEqual([]);
    expect(Object.isFrozen(locale)).toBe(true);
    expect(locale.url).toMatchObject({ segment: "{-$locale}" });
  });

  it("normalizes firstVisit defaults", () => {
    const locale = defineLocaleConfig({
      locales: ["en"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "as-needed" as const },
      adapters: { persist: [mockPersist("cookie:LOCALE")] },
    });
    expect(locale.firstVisit).toEqual({
      mode: "redirect",
      detectedLocaleHeader: "X-Locale-Detected",
    });
  });

  it("normalizes minimal config with locales and defaultLocale", () => {
    const locale = defineLocaleConfig({
      locales: ["en", "ar"] as const,
      defaultLocale: "en" as const,
    });

    expect(locale.defaultLocale).toBe("en");
    expect(locale.url).toMatchObject({
      prefix: "as-needed",
      segment: "{-$locale}",
    });
    expect(locale.persist).toHaveLength(1);
    expect(locale.persist[0]?.id).toBe("cookie:LOCALE");
    expect(locale.infer).toEqual([]);
    expect(locale.adapters.infer).toEqual([]);
    expect(locale.firstVisit).toEqual({
      mode: "redirect",
      detectedLocaleHeader: "X-Locale-Detected",
    });
    expect(Object.isFrozen(locale)).toBe(true);
  });
});
