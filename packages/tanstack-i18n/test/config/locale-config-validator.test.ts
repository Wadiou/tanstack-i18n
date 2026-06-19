import { describe, expect, it } from "vitest";
import { defineLocaleConfig } from "../../src/config/define-locale.js";
import { LocaleConfigValidator } from "../../src/config/locale-config-validator.js";
import { LocaleConfigError } from "../../src/errors.js";
import type { InferAdapter } from "../../src/types.js";
import {
  mockInfer,
  mockPersist,
  noopWrite,
  validDefineLocaleInput,
} from "../helpers/mock-adapters.js";

describe("LocaleConfigValidator.validate", () => {
  it("accepts valid 90% config", () => {
    const locale = defineLocaleConfig(validDefineLocaleInput());
    expect(() => LocaleConfigValidator.validate(locale)).not.toThrow();
  });

  it("throws when persist and infer are both empty", () => {
    const locale = defineLocaleConfig({
      ...validDefineLocaleInput(),
      adapters: { persist: [], infer: [] },
    });
    expect(() => LocaleConfigValidator.validate(locale)).toThrow(
      LocaleConfigError
    );
    expect(() => LocaleConfigValidator.validate(locale)).toThrow(
      "No locale resolution fallback"
    );
    expect(() => LocaleConfigValidator.validate(locale)).toThrow(
      "@Wadiou/tanstack-i18n:"
    );
  });

  it("throws when url.prefix is never and persist is empty", () => {
    const locale = defineLocaleConfig({
      locales: ["en", "ar"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "never" as const },
      adapters: { persist: [], infer: [mockInfer("accept-language")] },
    });
    expect(() => LocaleConfigValidator.validate(locale)).toThrow(
      LocaleConfigError
    );
    expect(() => LocaleConfigValidator.validate(locale)).toThrow(
      'No persistence backend for prefix "never"'
    );
  });

  it("throws on duplicate adapter id", () => {
    const locale = defineLocaleConfig({
      ...validDefineLocaleInput(),
      adapters: {
        persist: [mockPersist("cookie:LOCALE"), mockPersist("cookie:LOCALE")],
        infer: [mockInfer("accept-language")],
      },
    });
    expect(() => LocaleConfigValidator.validate(locale)).toThrow(
      LocaleConfigError
    );
    expect(() => LocaleConfigValidator.validate(locale)).toThrow(
      "Duplicate adapter id"
    );
  });

  it("throws when infer adapter has write property", () => {
    const badInfer = {
      id: "bad-infer",
      read: () => null,
      write: noopWrite,
    };
    const locale = defineLocaleConfig({
      ...validDefineLocaleInput(),
      adapters: {
        persist: [mockPersist("cookie:LOCALE")],
        infer: [badInfer as unknown as InferAdapter],
      },
    });
    expect(() => LocaleConfigValidator.validate(locale)).toThrow(
      LocaleConfigError
    );
    expect(() => LocaleConfigValidator.validate(locale)).toThrow(
      "Infer adapters are read-only"
    );
  });
});
