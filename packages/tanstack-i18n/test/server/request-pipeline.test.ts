import { describe, expect, it } from "vitest";
import { RequestPipeline } from "../../src/server/request-pipeline.js";
import { processRequestScenarios } from "../fixtures/process-request-matrix.js";
import { buildPipelineStateForScenario } from "../helpers/process-request-matrix-pipeline.js";

describe("RequestPipeline detect gate", () => {
  it("returns detect without Set-Cookie when matrix expects detect", async () => {
    const scenario = processRequestScenarios.find((s) => s.id === "H1");
    if (!scenario) {
      throw new Error("Missing H1 scenario");
    }
    const state = buildPipelineStateForScenario(scenario);
    const result = await RequestPipeline.run(state);

    expect(result).toEqual(scenario.expected);
    expect(result.action).toBe("detect");
  });

  it("skips detect when localize is a no-op (never prefix)", async () => {
    const scenario = processRequestScenarios.find((s) => s.id === "H11");
    if (!scenario) {
      throw new Error("Missing H11 scenario");
    }
    const state = buildPipelineStateForScenario(scenario);
    const result = await RequestPipeline.run(state);

    expect(result.action).not.toBe("detect");
    expect(result).toEqual({ action: "sync-cookie", locale: "ar" });
  });
});

describe.each(processRequestScenarios)("$id RequestPipeline", (scenario) => {
  it("run matches matrix", async () => {
    const state = buildPipelineStateForScenario(scenario);
    const result = await RequestPipeline.run(state);
    expect(result).toEqual(scenario.expected);
  });
});
