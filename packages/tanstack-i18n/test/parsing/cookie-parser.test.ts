import { describe, expect, it } from "vitest";
import { CookieParser } from "../../src/parsing/cookie-parser.js";

const locales = ["en", "ar"] as const;

describe("CookieParser", () => {
  it("parses a valid locale cookie value", () => {
    expect(CookieParser.readLocale("LOCALE=ar", "LOCALE", locales)).toBe("ar");
  });

  it("returns null when cookie is missing", () => {
    expect(CookieParser.readLocale("", "LOCALE", locales)).toBeNull();
  });

  it("returns null for unsupported locale values", () => {
    expect(CookieParser.readLocale("LOCALE=de", "LOCALE", locales)).toBeNull();
  });

  it("reads LOCALE among other cookies", () => {
    expect(
      CookieParser.readLocale(
        "theme=dark; LOCALE=ar; session=abc",
        "LOCALE",
        locales
      )
    ).toBe("ar");
  });
});
