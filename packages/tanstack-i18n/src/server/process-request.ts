/** server — locale middleware entry; delegates to {@link RequestPipeline}. */
import { AdapterChain } from "../resolution/adapter-chain.js";
import { PathParser } from "../routing/path-parser.js";
import type { LocaleConfig, LocaleRequestResult } from "../types.js";
import { type PipelineState, RequestPipeline } from "./request-pipeline.js";

/**
 * Server middleware entry used by `CreateServerEntry`.
 *
 * @see {@link RequestPipeline}
 */
export class ProcessRequest {
  /** Returns a bound `processRequest(request)` handler for the given {@link LocaleConfig}. */
  static createBound(config: LocaleConfig) {
    return (request: Request): Promise<LocaleRequestResult> =>
      ProcessRequest.handle(request, config);
  }

  /**
   * Builds {@link PipelineState} and delegates to {@link RequestPipeline.run}.
   *
   * @see {@link ProcessRequest.buildPipelineState}
   */
  private static handle(
    request: Request,
    baseConfig: LocaleConfig
  ): Promise<LocaleRequestResult> {
    const state = ProcessRequest.buildPipelineState(request, baseConfig);
    return RequestPipeline.run(state);
  }

  /**
   * Assembles effective {@link LocaleConfig} and {@link PathnameKind} for one request.
   *
   * 1. {@link AdapterChain.resolveEffective} — persist + infer override chains
   * 2. {@link AdapterChain.resolveFirstVisitConfig} — merged `firstVisit` for this pathname
   * 3. {@link PathParser.classify} — ignored / prefixed / unprefixed
   *
   * @see {@link AdapterChain.resolveEffective}
   * @see {@link PathParser.classify}
   */
  private static buildPipelineState(
    request: Request,
    baseConfig: LocaleConfig
  ): PipelineState {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const persistMatch = { pathname, config: baseConfig };
    const inferMatch = { request, pathname, config: baseConfig };

    // 1. Effective persist + infer chains for this pathname
    const resolved = AdapterChain.resolveEffective(
      baseConfig.adapters,
      baseConfig,
      persistMatch,
      inferMatch
    );
    // 2. Effective firstVisit (partial override merge)
    const firstVisit = Object.freeze(
      AdapterChain.resolveFirstVisitConfig(
        baseConfig.adapters,
        baseConfig,
        inferMatch
      )
    );
    const config = Object.freeze({ ...resolved, firstVisit }) as LocaleConfig;
    const cookieHeader = request.headers.get("cookie") ?? undefined;
    // 3. Pathname kind drives which pipeline step runs
    const kind = PathParser.classify(pathname, config);

    return { request, url, pathname, config, kind, cookieHeader };
  }
}
