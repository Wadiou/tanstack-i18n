import { describe, expect, it } from "vitest";
import { LOCALE_REDIRECT_STATUS } from "../../src/constants.js";
import { UrlRewriter } from "../../src/routing/url-rewrite.js";
import { asNeededLocaleConfig } from "../helpers/mock-adapters.js";
import { buildLocaleConfig } from "../helpers/process-request-matrix.js";

describe("UrlRewriter.deLocalize", () => {
  const config = asNeededLocaleConfig();

  it("strips locale prefix from public URL", () => {
    const url = new URL("http://localhost/ar/auth");
    expect(UrlRewriter.deLocalize(url, config).pathname).toBe("/auth");
  });

  it("returns unchanged URL when no locale prefix", () => {
    const url = new URL("http://localhost/auth");
    expect(UrlRewriter.deLocalize(url, config).pathname).toBe("/auth");
  });

  it("returns unchanged URL on ignored paths", () => {
    const url = new URL("http://localhost/api/foo");
    expect(UrlRewriter.deLocalize(url, config).pathname).toBe("/api/foo");
  });
});

describe("UrlRewriter.localize", () => {
  const config = asNeededLocaleConfig();

  it("prepends locale for non-default locale", () => {
    const url = new URL("http://localhost/auth");
    expect(UrlRewriter.localize(url, "ar", config).pathname).toBe("/ar/auth");
  });

  it("leaves default locale unprefixed in as-needed mode", () => {
    const url = new URL("http://localhost/auth");
    expect(UrlRewriter.localize(url, "en", config).pathname).toBe("/auth");
  });

  it("returns unchanged URL on ignored paths", () => {
    const url = new URL("http://localhost/dashboard/todos");
    expect(UrlRewriter.localize(url, "ar", config).pathname).toBe(
      "/dashboard/todos"
    );
  });

  it("prepends en prefix in always mode", () => {
    const alwaysConfig = buildLocaleConfig("always");
    const url = new URL("http://localhost/auth");
    expect(UrlRewriter.localize(url, "en", alwaysConfig).pathname).toBe(
      "/en/auth"
    );
  });
});

describe("UrlRewriter.resolvePrefixStripRedirect", () => {
  const asNeeded = asNeededLocaleConfig();

  it("redirects default locale prefix away in as-needed mode (B1)", () => {
    const url = new URL("http://localhost/en/auth");
    expect(
      UrlRewriter.resolvePrefixStripRedirect(url, asNeeded, "prefixed")
    ).toEqual({
      redirectUrl: "http://localhost/auth",
      locale: "en",
      status: 301,
    });
  });

  it("strips prefix on ignored stripped path (B2)", () => {
    const url = new URL("http://localhost/ar/dashboard/todos");
    expect(
      UrlRewriter.resolvePrefixStripRedirect(url, asNeeded, "prefixed")
    ).toEqual({
      redirectUrl: "http://localhost/dashboard/todos",
      locale: "ar",
      status: 301,
    });
  });

  it("strips any prefix under never mode (F3)", () => {
    const neverConfig = buildLocaleConfig("never");
    const url = new URL("http://localhost/ar/auth");
    expect(
      UrlRewriter.resolvePrefixStripRedirect(url, neverConfig, "prefixed")
    ).toEqual({
      redirectUrl: "http://localhost/auth",
      locale: "ar",
      status: 301,
    });
  });

  it("returns null for valid non-default prefix on public path", () => {
    const url = new URL("http://localhost/ar/auth");
    expect(
      UrlRewriter.resolvePrefixStripRedirect(url, asNeeded, "prefixed")
    ).toBeNull();
  });

  it("returns null for unprefixed paths in always mode", () => {
    const alwaysConfig = buildLocaleConfig("always");
    const url = new URL("http://localhost/auth");
    expect(
      UrlRewriter.resolvePrefixStripRedirect(url, alwaysConfig, "unprefixed")
    ).toBeNull();
  });

  it("returns null for unprefixed paths in as-needed mode", () => {
    const url = new URL("http://localhost/auth");
    expect(
      UrlRewriter.resolvePrefixStripRedirect(url, asNeeded, "unprefixed")
    ).toBeNull();
  });
});

describe("UrlRewriter.resolveLocalizeAction", () => {
  it("redirects when cookie ar on unprefixed auth (D3)", () => {
    const config = buildLocaleConfig("as-needed");
    const url = new URL("http://localhost/auth");

    expect(UrlRewriter.resolveLocalizeAction(url, "ar", "ar", config)).toEqual({
      action: "redirect",
      redirectUrl: "http://localhost/ar/auth",
      locale: "ar",
      status: LOCALE_REDIRECT_STATUS,
    });
  });

  it("passes for default locale first visit under as-needed (D6)", () => {
    const config = buildLocaleConfig("as-needed");
    const url = new URL("http://localhost/auth");

    expect(UrlRewriter.resolveLocalizeAction(url, "en", null, config)).toEqual({
      action: "pass",
    });
  });

  it("redirects to en prefix under always (E3)", () => {
    const config = buildLocaleConfig("always");
    const url = new URL("http://localhost/auth");

    expect(UrlRewriter.resolveLocalizeAction(url, "en", null, config)).toEqual({
      action: "redirect",
      redirectUrl: "http://localhost/en/auth",
      locale: "en",
      status: LOCALE_REDIRECT_STATUS,
    });
  });
});

describe("UrlRewriter.createBound", () => {
  const config = asNeededLocaleConfig();
  const { deLocalizeUrl, localizeUrl } = UrlRewriter.createBound(config);

  it("round-trips deLocalizeUrl and localizeUrl with explicit locale", () => {
    const url = new URL("http://localhost/ar/auth");
    const deLocalized = deLocalizeUrl(url);
    expect(deLocalized.pathname).toBe("/auth");
    expect(localizeUrl(deLocalized, "ar").pathname).toBe("/ar/auth");
  });

  it("uses URL segment when locale is omitted on prefixed path", () => {
    const url = new URL("http://localhost/ar/auth");
    expect(localizeUrl(url).pathname).toBe("/ar/auth");
  });

  it("falls back to defaultLocale when locale omitted on unprefixed path", () => {
    const url = new URL("http://localhost/auth");
    expect(localizeUrl(url).pathname).toBe("/auth");
  });
});
