import { describe, expect, it } from "vitest";
import { defineLocaleConfig } from "../../src/config/define-locale.js";
import { PathParser } from "../../src/routing/path-parser.js";
import {
  asNeededLocaleConfig,
  ignoredPathsRegex,
} from "../helpers/mock-adapters.js";

describe("PathParser.shouldIgnore", () => {
  const url = { prefix: "as-needed" as const, ignoredPaths: ignoredPathsRegex };

  it.each([
    "/api",
    "/api/foo",
    "/rpc",
    "/health",
    "/dashboard/todos",
    "/dashboard-test/foo",
    "/test-ping",
  ])("ignores %s", (pathname) => {
    expect(PathParser.shouldIgnore(pathname, url)).toBe(true);
  });

  it.each(["/auth", "/ar/auth", "/"])("does not ignore %s", (pathname) => {
    expect(PathParser.shouldIgnore(pathname, url)).toBe(false);
  });

  it("returns false when ignoredPaths is unset", () => {
    expect(PathParser.shouldIgnore("/api/foo", { prefix: "as-needed" })).toBe(
      false
    );
  });
});

describe("PathParser.extractLocale", () => {
  const locales = ["en", "ar"] as const;

  it.each([
    ["/ar/auth", "ar"],
    ["/ar", "ar"],
    ["/en/auth", "en"],
  ])("extracts %s → %s", (pathname, locale) => {
    expect(PathParser.extractLocale(pathname, locales)).toBe(locale);
  });

  it.each(["/auth", "/de/auth"])("returns null for %s", (pathname) => {
    expect(PathParser.extractLocale(pathname, locales)).toBeNull();
  });
});

describe("PathParser.classify", () => {
  const asNeeded = asNeededLocaleConfig();

  it.each([
    ["/dashboard/todos", "ignored"],
    ["/ar/auth", "prefixed"],
    ["/auth", "unprefixed"],
    ["/de/auth", "unprefixed"],
  ])("classifies %s as %s", (pathname, kind) => {
    expect(PathParser.classify(pathname, asNeeded)).toBe(kind);
  });
});

describe("PathParser.resolveUrlLocale", () => {
  const asNeeded = asNeededLocaleConfig();

  it.each([
    ["/ar/auth", "ar"],
    ["/ar", "ar"],
  ])("as-needed resolves %s → %s", (pathname, locale) => {
    expect(PathParser.resolveUrlLocale(pathname, asNeeded)).toBe(locale);
  });

  it.each([
    "/auth",
    "/en/auth",
    "/de/auth",
  ])("as-needed returns null for %s", (pathname) => {
    expect(PathParser.resolveUrlLocale(pathname, asNeeded)).toBeNull();
  });

  it("returns null on ignored paths", () => {
    expect(
      PathParser.resolveUrlLocale("/dashboard/todos", asNeeded)
    ).toBeNull();
  });

  it("always prefix returns default locale segment", () => {
    const always = defineLocaleConfig({
      locales: ["en", "ar"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "always" as const },
      adapters: { persist: [], infer: [] },
    });

    expect(PathParser.resolveUrlLocale("/en/auth", always)).toBe("en");
    expect(PathParser.resolveUrlLocale("/ar/auth", always)).toBe("ar");
  });

  it("never prefix always returns null", () => {
    const never = defineLocaleConfig({
      locales: ["en", "ar"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "never" as const },
      adapters: { persist: [], infer: [] },
    });

    expect(PathParser.resolveUrlLocale("/ar/auth", never)).toBeNull();
  });
});
