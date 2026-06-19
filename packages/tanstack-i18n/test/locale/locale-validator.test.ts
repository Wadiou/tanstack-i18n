import { describe, expect, it } from "vitest";
import { hasLocale } from "../../src/locale/locale-validator.js";

const locales = ["en", "ar"] as const;

describe("hasLocale", () => {
  it("returns true for a supported locale", () => {
    expect(hasLocale("en", locales)).toBe(true);
  });

  it("returns false for an unsupported locale", () => {
    expect(hasLocale("de", locales)).toBe(false);
  });

  it("returns false for null or undefined", () => {
    expect(hasLocale(null, locales)).toBe(false);
    expect(hasLocale(undefined, locales)).toBe(false);
  });
});
