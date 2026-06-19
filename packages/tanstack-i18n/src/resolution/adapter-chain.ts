import type {
  FirstVisitConfig,
  InferAdapter,
  InferMatchContext,
  InferRunContext,
  Locale,
  LocaleAdapters,
  LocaleConfig,
  PersistAdapter,
  PersistMatchContext,
  PersistRunContext,
} from "../types.js";

/** Resolution — override merge and chain-of-responsibility runs. */
export class AdapterChain {
  /**
   * Returns the effective persist adapter chain for a {@link PersistMatchContext}.
   * First matching persist override replaces {@link LocaleAdapters.persist}; otherwise the default chain.
   */
  static resolvePersistChain(
    adapters: LocaleAdapters,
    ctx: PersistMatchContext
  ): PersistAdapter[] {
    const rule = adapters.overrides?.find(
      (r) => r.target === "persist" && r.match(ctx)
    );
    return rule?.target === "persist" ? rule.persist : adapters.persist;
  }

  /**
   * Returns the effective infer adapter chain for an {@link InferMatchContext}.
   * First matching infer override replaces the infer list; otherwise {@link LocaleAdapters.infer} (or empty).
   */
  static resolveInferChain(
    adapters: LocaleAdapters,
    ctx: InferMatchContext
  ): InferAdapter[] {
    const rule = adapters.overrides?.find(
      (r) => r.target === "infer" && r.match(ctx)
    );
    return rule?.target === "infer" ? rule.infer : (adapters.infer ?? []);
  }

  /**
   * Returns effective firstVisit config for an {@link InferMatchContext}.
   * First matching firstVisit override merges partial fields over global.
   * Server middleware only — merged in `processRequest`, not `getLocale`.
   */
  static resolveFirstVisitConfig(
    adapters: LocaleAdapters,
    base: Pick<LocaleConfig, "firstVisit">,
    match: InferMatchContext
  ): FirstVisitConfig {
    const global = base.firstVisit;
    const rule = adapters.overrides?.find(
      (r) => r.target === "firstVisit" && r.match(match)
    );

    // First matching override merges partial fields over global defaults
    if (rule?.target === "firstVisit") {
      return { ...global, ...rule.firstVisit };
    }

    return global;
  }

  /**
   * Merges override rules into an effective (override-resolved) {@link LocaleConfig} slice.
   * Persist overrides always run via {@link AdapterChain.resolvePersistChain}.
   * Infer overrides run only when optional {@link InferMatchContext} is passed (`processRequest`);
   * omitted in `getLocale` (base infer chain kept, overrides not applied).
   * firstVisit is merged separately in `processRequest` only.
   *
   * @see {@link AdapterChain.resolvePersistChain}
   * @see {@link AdapterChain.resolveInferChain}
   */
  static resolveEffective(
    adapters: LocaleAdapters,
    base: Pick<
      LocaleConfig,
      "locales" | "defaultLocale" | "url" | "firstVisit"
    >,
    match: PersistMatchContext,
    request?: InferMatchContext
  ): LocaleConfig {
    const persist = AdapterChain.resolvePersistChain(adapters, match);
    // Infer overrides apply only when infer match context is provided (processRequest)
    const infer = request
      ? AdapterChain.resolveInferChain(adapters, request)
      : (adapters.infer ?? []);

    return Object.freeze({
      ...base,
      adapters: Object.freeze({
        persist,
        infer,
        overrides: adapters.overrides,
      }),
      persist,
      infer,
    }) as LocaleConfig;
  }

  /**
   * Runs {@link PersistAdapter} chain in declaration order until one returns a locale.
   * Awaits async `read`; returns null when every adapter misses (caller uses {@link LocaleConfig["defaultLocale"]}).
   *
   * @see {@link AdapterChain.resolvePersistChain} for how the chain is chosen
   */
  static async runPersist(
    adapters: PersistAdapter[],
    ctx: PersistRunContext
  ): Promise<Locale | null> {
    for (const adapter of adapters) {
      const found = await adapter.read(ctx);
      if (found) {
        return found;
      }
    }

    return null;
  }

  /**
   * Runs persist write chain in declaration order — same sequencing as {@link AdapterChain.runPersist}.
   * Throws propagate; remaining adapters are not run.
   */
  static async writePersist(
    adapters: PersistAdapter[],
    locale: Locale,
    ctx: PersistRunContext
  ): Promise<void> {
    for (const adapter of adapters) {
      await adapter.write(locale, ctx);
    }
  }

  /**
   * Runs {@link InferAdapter} chain synchronously until one returns a locale.
   * Same stop-on-first pattern as {@link AdapterChain.runPersist}; used on middleware first-visit.
   */
  static runInfer(
    adapters: InferAdapter[],
    ctx: InferRunContext
  ): Locale | null {
    for (const adapter of adapters) {
      const found = adapter.read(ctx);
      if (found) {
        return found;
      }
    }

    return null;
  }

  /**
   * Resolves middleware target locale: persist → infer (GET only) → defaultLocale.
   * Expects override-resolved {@link LocaleConfig} from {@link AdapterChain.resolveEffective}.
   */
  static async resolveTarget(
    request: Request,
    persistCtx: PersistRunContext,
    inferCtx: InferRunContext,
    config: LocaleConfig
  ): Promise<{ target: Locale; persist: Locale | null }> {
    // 1. Persist chain — stored preference wins; persist field set for sync-cookie logic
    const persist = await AdapterChain.runPersist(config.persist, persistCtx);
    if (persist) {
      return { target: persist, persist };
    }

    // 2. Infer chain — GET only; falls back to defaultLocale
    let target: Locale = config.defaultLocale;
    if (request.method === "GET" && config.infer.length > 0) {
      const inferred = AdapterChain.runInfer(config.infer, inferCtx);
      if (inferred) {
        target = inferred;
      }
    }

    return { target, persist: null };
  }

  /**
   * Collects `serialize()` output from each {@link PersistAdapter} that defines it.
   * Used by `processRequest` to build Set-Cookie headers after locale sync.
   */
  static serializePersist(
    locale: Locale,
    adapters: PersistAdapter[]
  ): string[] {
    const cookies: string[] = [];

    for (const adapter of adapters) {
      if (adapter.serialize) {
        cookies.push(adapter.serialize(locale));
      }
    }

    return cookies;
  }
}
