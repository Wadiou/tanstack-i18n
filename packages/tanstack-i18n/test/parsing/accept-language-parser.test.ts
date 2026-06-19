import { describe, expect, it } from "vitest";
import { acceptLanguage } from "../../src/adapters/index.js";
import { AcceptLanguageParser } from "../../src/parsing/accept-language-parser.js";
import { mockInferContext } from "../helpers/mock-adapters.js";

const locales = ["en", "ar"] as const;
const defaultLocale = "en";

describe("AcceptLanguageParser.resolve", () => {
  it("prefers the highest-quality supported locale", () => {
    expect(
      AcceptLanguageParser.resolve(
        "ar-SA,ar;q=0.9,en;q=0.8",
        locales,
        defaultLocale
      )
    ).toBe("ar");
  });

  it("returns null when only the default locale matches", () => {
    expect(
      AcceptLanguageParser.resolve("en-US,en;q=0.9", locales, defaultLocale)
    ).toBeNull();
  });

  it("returns null for missing or empty headers", () => {
    expect(
      AcceptLanguageParser.resolve(null, locales, defaultLocale)
    ).toBeNull();
    expect(AcceptLanguageParser.resolve("", locales, defaultLocale)).toBeNull();
    expect(
      AcceptLanguageParser.resolve("   ", locales, defaultLocale)
    ).toBeNull();
  });

  it("returns null for unsupported languages", () => {
    expect(
      AcceptLanguageParser.resolve("de-DE,de;q=0.9", locales, defaultLocale)
    ).toBeNull();
  });

  it("returns a non-default supported locale when it ranks first", () => {
    expect(
      AcceptLanguageParser.resolve("ar,en;q=0.5", locales, defaultLocale)
    ).toBe("ar");
  });

  it("skips locales with q=0", () => {
    expect(
      AcceptLanguageParser.resolve("ar;q=0,en;q=0.9", locales, defaultLocale)
    ).toBeNull();
  });

  it("falls back to the next highest-q supported locale", () => {
    expect(
      AcceptLanguageParser.resolve("en;q=0.1,ar;q=0.9", locales, defaultLocale)
    ).toBe("ar");
  });
});

describe("acceptLanguage adapter", () => {
  const adapter = acceptLanguage();

  it("reads Accept-Language from request on server", () => {
    const request = new Request("https://example.com/", {
      headers: { "accept-language": "ar-SA,ar;q=0.9,en;q=0.8" },
    });

    expect(
      adapter.read(
        mockInferContext({
          request,
          locales,
          defaultLocale,
        })
      )
    ).toBe("ar");
  });
});
