import { describe, expect, it } from "vitest";
import { processRequestScenarios } from "../fixtures/process-request-matrix.js";
import {
  buildProcessRequestForScenario,
  buildRequest,
} from "../helpers/process-request-matrix.js";

describe.each(processRequestScenarios)("$id $group", (scenario) => {
  it("processRequest matches matrix", async () => {
    const processRequest = buildProcessRequestForScenario(scenario);
    const result = await processRequest(buildRequest(scenario));
    expect(result).toEqual(scenario.expected);
  });
});
