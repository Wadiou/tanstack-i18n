import { describe, expect, it, vi } from "vitest";
import { localStorage } from "../../src/adapters/index.js";
import { mockPersistContext } from "../helpers/mock-adapters.js";

describe("LocalStorageAdapter", () => {
  it("defaults key to LOCALE when called with no args", () => {
    expect(localStorage().id).toBe("localStorage:LOCALE");
  });

  const adapter = localStorage({ key: "CUSTOM_LOCALE" });
  const locales = ["en", "ar"] as const;

  it("returns null on server read", () => {
    const ctx = mockPersistContext({ runtime: "server", locales });
    expect(adapter.read(ctx)).toBeNull();
  });

  it("reads from window.localStorage on client", () => {
    const originalWindow = globalThis.window;

    globalThis.window = {
      localStorage: {
        getItem: vi.fn().mockReturnValue("ar"),
      },
    } as any;

    try {
      expect(
        adapter.read(
          mockPersistContext({
            runtime: "client",
            locales,
          })
        )
      ).toBe("ar");

      expect(globalThis.window.localStorage.getItem).toHaveBeenCalledWith(
        "CUSTOM_LOCALE"
      );
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it("returns null if window.localStorage.getItem throws", () => {
    const originalWindow = globalThis.window;

    globalThis.window = {
      localStorage: {
        getItem: vi.fn().mockImplementation(() => {
          throw new Error("Access denied");
        }),
      },
    } as any;

    try {
      expect(
        adapter.read(
          mockPersistContext({
            runtime: "client",
            locales,
          })
        )
      ).toBeNull();
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it("writes to window.localStorage on client", async () => {
    const originalWindow = globalThis.window;

    globalThis.window = {
      localStorage: {
        setItem: vi.fn(),
      },
    } as any;

    try {
      await adapter.write(
        "ar",
        mockPersistContext({ runtime: "client", locales })
      );

      expect(globalThis.window.localStorage.setItem).toHaveBeenCalledWith(
        "CUSTOM_LOCALE",
        "ar"
      );
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it("ignores write errors", async () => {
    const originalWindow = globalThis.window;

    globalThis.window = {
      localStorage: {
        setItem: vi.fn().mockImplementation(() => {
          throw new Error("Quota exceeded");
        }),
      },
    } as any;

    try {
      await expect(
        adapter.write("ar", mockPersistContext({ runtime: "client", locales }))
      ).resolves.toBeUndefined();
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it("no-ops write on server", async () => {
    await expect(
      adapter.write("ar", mockPersistContext({ runtime: "server", locales }))
    ).resolves.toBeUndefined();
  });
});
