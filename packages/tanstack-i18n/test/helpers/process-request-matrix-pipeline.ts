import { AdapterChain } from "../../src/resolution/adapter-chain.js";
import { PathParser } from "../../src/routing/path-parser.js";
import type { PipelineState } from "../../src/server/request-pipeline.js";
import type { LocaleConfig } from "../../src/types.js";
import type { ProcessRequestScenario } from "../fixtures/process-request-matrix.js";
import {
  buildLocaleConfigForScenario,
  buildRequest,
} from "./process-request-matrix.js";

export function buildPipelineStateForScenario(
  scenario: ProcessRequestScenario
): PipelineState {
  const request = buildRequest(scenario);
  const baseConfig = buildLocaleConfigForScenario(scenario);
  const url = new URL(request.url);
  const pathname = url.pathname;
  const persistMatch = { pathname, config: baseConfig };
  const inferMatch = { request, pathname, config: baseConfig };
  const resolved = AdapterChain.resolveEffective(
    baseConfig.adapters,
    baseConfig,
    persistMatch,
    inferMatch
  );
  const firstVisit = Object.freeze(
    AdapterChain.resolveFirstVisitConfig(
      baseConfig.adapters,
      baseConfig,
      inferMatch
    )
  );
  const config = Object.freeze({ ...resolved, firstVisit }) as LocaleConfig;
  const cookieHeader = request.headers.get("cookie") ?? undefined;
  const kind = PathParser.classify(pathname, config);

  return { request, url, pathname, config, kind, cookieHeader };
}
