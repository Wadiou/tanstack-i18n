import { describe, expect, it } from "vitest";
import { acceptLanguage, cookie } from "../../src/adapters/index.js";
import { defineLocaleConfig } from "../../src/config/define-locale.js";
import { LocaleConfigValidator } from "../../src/config/locale-config-validator.js";
import { mockPersistContext } from "../helpers/mock-adapters.js";

describe("CookieAdapter", () => {
  it("defaults name to LOCALE when called with no args", () => {
    expect(cookie().id).toBe("cookie:LOCALE");
  });

  const adapter = cookie({ name: "LOCALE" });
  const locales = ["en", "ar"] as const;

  it("reads a valid locale from cookie header on server", () => {
    const ctx = mockPersistContext({
      cookieHeader: "LOCALE=ar",
      locales,
    });

    expect(adapter.read(ctx)).toBe("ar");
  });

  it("reads from document.cookie on client", () => {
    const originalDocument = globalThis.document;
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: { cookie: "LOCALE=ar" },
    });

    try {
      expect(
        adapter.read(
          mockPersistContext({
            runtime: "client",
            locales,
          })
        )
      ).toBe("ar");
    } finally {
      Object.defineProperty(globalThis, "document", {
        configurable: true,
        value: originalDocument,
      });
    }
  });

  it("serializes Set-Cookie header value", () => {
    expect(adapter.serialize?.("ar")).toBe(
      "LOCALE=ar; Path=/; Max-Age=31536000; SameSite=lax"
    );
  });

  it("writes via document.cookie on client when cookieStore is unavailable", async () => {
    const originalDocument = globalThis.document;
    const originalWindow = globalThis.window;
    let written = "";

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        get cookie() {
          return written;
        },
        set cookie(value: string) {
          written = value;
        },
      },
    });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {},
    });

    try {
      await adapter.write(
        "ar",
        mockPersistContext({ runtime: "client", locales })
      );
      expect(written).toBe("LOCALE=ar;path=/;max-age=31536000;samesite=lax");
    } finally {
      Object.defineProperty(globalThis, "document", {
        configurable: true,
        value: originalDocument,
      });
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: originalWindow,
      });
    }
  });

  it("no-ops write on server", async () => {
    await expect(
      adapter.write("ar", mockPersistContext({ runtime: "server", locales }))
    ).resolves.toBeUndefined();
  });
});

describe("defineLocaleConfig with real adapters", () => {
  it("passes LocaleConfigValidator.validate", () => {
    const locale = defineLocaleConfig({
      locales: ["en", "ar"] as const,
      defaultLocale: "en" as const,
      url: { prefix: "as-needed" as const },
      adapters: {
        persist: [cookie({ name: "LOCALE" })],
        infer: [acceptLanguage()],
      },
    });

    expect(() => LocaleConfigValidator.validate(locale)).not.toThrow();
  });
});
