import { describe, expect, it, vi } from "vitest";
import { processRequestScenarios } from "../fixtures/process-request-matrix.js";
import {
  buildRequest,
  buildRuntimeForScenario,
} from "../helpers/process-request-matrix.js";

describe.each(
  processRequestScenarios
)("$id $group createServerEntry", (scenario) => {
  it("maps processRequest action to HTTP", async () => {
    const handler = vi.fn(
      async (_req: Request) => new Response("ok", { status: 200 })
    );
    const core = buildRuntimeForScenario(scenario);
    const fetch = core.createServerEntry(handler);
    const response = await fetch(buildRequest(scenario));

    if (scenario.expected.action === "pass") {
      expect(handler).toHaveBeenCalledOnce();
      expect(response.status).toBe(200);
      expect(response.headers.get("Location")).toBeNull();
      expect(response.headers.get("Set-Cookie")).toBeNull();
      return;
    }

    if (scenario.expected.action === "redirect") {
      expect(handler).not.toHaveBeenCalled();
      expect(response.status).toBe(scenario.expected.status);
      expect(response.headers.get("Location")).toBe(
        scenario.expected.redirectUrl
      );
      expect(response.headers.get("Set-Cookie")).toContain(
        `LOCALE=${scenario.expected.locale}`
      );
      return;
    }

    if (scenario.expected.action === "sync-cookie") {
      expect(handler).toHaveBeenCalledOnce();
      expect(response.status).toBe(200);
      expect(response.headers.get("Set-Cookie")).toContain(
        `LOCALE=${scenario.expected.locale}`
      );
      return;
    }

    if (scenario.expected.action === "detect") {
      expect(handler).toHaveBeenCalledOnce();
      const callArgs = handler.mock.calls[0] || [];
      const passedRequest = callArgs[0] as Request;
      expect(
        passedRequest.headers.get(scenario.expected.detectedLocaleHeader)
      ).toBe(scenario.expected.detectedLocale);
      expect(response.status).toBe(200);
      expect(response.headers.get("Set-Cookie")).toBeNull();
      expect(
        response.headers.get(scenario.expected.detectedLocaleHeader)
      ).toBeNull();
    }
  });
});
