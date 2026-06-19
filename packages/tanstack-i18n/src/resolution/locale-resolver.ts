/** resolution — getLocale orchestration. */
import { RunContextBuilder } from "../context/run-context.js";
import { PathParser } from "../routing/path-parser.js";
import type {
  Locale,
  LocaleConfig,
  LocaleReadContext,
  PersistMatchContext,
  PersistRunContext,
  Promisable,
} from "../types.js";
import { AdapterChain } from "./adapter-chain.js";

/**
 * Resolves the active locale for `getLocale` — URL segment, then persist chain, then {@link LocaleConfig["defaultLocale"]}.
 */
export class LocaleResolver {
  /**
   * Resolution precedence for the current runtime/pathname:
   * 1. `PathParser.resolveUrlLocale` when the URL carries a valid locale segment
   * 2. {@link AdapterChain.runPersist} on the effective {@link LocaleConfig.persist} chain
   * 3. {@link LocaleConfig["defaultLocale"]}
   *
   * {@link LocaleResolver.preparePersistState} runs only when step 1 misses.
   */
  static async resolve(
    config: LocaleConfig,
    context?: LocaleReadContext
  ): Promise<Locale> {
    const { pathname, request } = RunContextBuilder.resolveReadContext(context);

    // 1. URL segment when prefix mode exposes a resolvable locale
    const fromUrl = PathParser.resolveUrlLocale(pathname, config);
    if (fromUrl) {
      return fromUrl;
    }

    const { effective, persistCtx } = LocaleResolver.preparePersistState(
      config,
      pathname,
      request
    );

    // 2. Persist chain on effective config (persist overrides only)
    const fromPersist = await AdapterChain.runPersist(
      effective.persist,
      persistCtx
    );
    if (fromPersist) {
      return fromPersist;
    }

    // 3. Configured default
    return effective.defaultLocale;
  }

  /**
   * Persist-only effective config and run context for the current runtime/pathname.
   * Shared by `getLocale` and `changeLocale` — no infer override merge.
   */
  static preparePersistState(
    config: LocaleConfig,
    pathname?: string,
    request?: Request
  ): {
    pathname: string;
    effective: LocaleConfig;
    persistCtx: PersistRunContext;
  } {
    const runtime = RunContextBuilder.getRuntime();

    const resolvedPathname =
      pathname ??
      (runtime === "client"
        ? RunContextBuilder.getClientPathname()
        : // biome-ignore lint/style/noNestedTernary: we need to resolve the pathname from the request
          request
          ? new URL(request.url).pathname
          : "/");

    const match: PersistMatchContext = {
      pathname: resolvedPathname,
      config,
    };

    const effective = AdapterChain.resolveEffective(
      config.adapters,
      config,
      match
    );

    const persistCtx = RunContextBuilder.buildPersist({
      runtime,
      pathname: resolvedPathname,
      config: effective,
      request: runtime === "server" ? request : undefined,
    });

    return { pathname: resolvedPathname, effective, persistCtx };
  }

  /**
   * Returns a bound closure for `LocaleRuntime.getLocale`.
   *
   * @param config - Locale configuration
   */
  static createBound(config: LocaleConfig) {
    return (context?: LocaleReadContext): Promisable<Locale> =>
      LocaleResolver.resolve(config, context);
  }
}
