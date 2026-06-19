import { describe, expect, it, vi } from "vitest";
import { serverFn } from "../../src/adapters/index.js";
import { mockPersistContext, noopWrite } from "../helpers/mock-adapters.js";

describe("ServerFnAdapter", () => {
  it("returns read result on server", () => {
    const read = vi.fn(() => "ar");
    const write = vi.fn(noopWrite);
    const adapter = serverFn({ read, write });

    expect(adapter.read(mockPersistContext({ runtime: "server" }))).toBe("ar");
    expect(read).toHaveBeenCalledOnce();
  });

  it("returns null on client", () => {
    const read = vi.fn(() => "ar");
    const adapter = serverFn({ read, write: noopWrite });

    expect(adapter.read(mockPersistContext({ runtime: "client" }))).toBeNull();
    expect(read).not.toHaveBeenCalled();
  });

  it("delegates write to provided handler", async () => {
    const write = vi.fn(noopWrite);
    const adapter = serverFn({
      read: () => null,
      write,
    });
    const ctx = mockPersistContext({ runtime: "server" });

    await adapter.write("ar", ctx);

    expect(write).toHaveBeenCalledWith("ar", ctx);
  });

  it("does not expose serialize", () => {
    const adapter = serverFn({
      read: () => null,
      write: noopWrite,
    });

    expect(adapter.serialize).toBeUndefined();
  });
});
