/** server — TanStack Start fetch wrapper for processRequest + Set-Cookie. */
import { LOCALE_REDIRECT_STATUS } from "../constants.js";
import { AdapterChain } from "../resolution/adapter-chain.js";
import type {
  FetchHandler,
  Locale,
  LocaleConfig,
  LocaleRequestResult,
  PersistAdapter,
  Promisable,
} from "../types.js";
import { ProcessRequest } from "./process-request.js";

/**
 * Server fetch wrapper bound by `createLocaleRuntime` as `createServerEntry`.
 * Runs {@link ProcessRequest} before the app handler; attaches `Set-Cookie` on redirect and sync-cookie.
 *
 * @see {@link AdapterChain.serializePersist} for cookie header values from `persist[]`
 */
export class CreateServerEntry {
  /** Returns a bound `createServerEntry(handler)` factory for the given {@link LocaleConfig}. */
  static createBound(config: LocaleConfig) {
    const processRequest = ProcessRequest.createBound(config);

    return (handler: FetchHandler): FetchHandler =>
      (request: Request): Promise<Response> =>
        CreateServerEntry.handle(request, config, processRequest, handler);
  }

  /**
   * Wraps a single fetch: {@link ProcessRequest} first, then pass / redirect / sync-cookie / detect.
   *
   * 1. {@link ProcessRequest} — pass, redirect, sync-cookie, or detect
   * 2. `redirect` — {@link CreateServerEntry.handleRedirect} with `Location` + persist cookies
   * 3. `sync-cookie` — {@link CreateServerEntry.handleSyncCookie} runs handler, then persist cookies
   * 4. `detect` — {@link CreateServerEntry.handleDetect} runs handler, sets detect header (no Set-Cookie)
   * 5. `pass` — forward to handler
   */
  private static async handle(
    request: Request,
    config: LocaleConfig,
    processRequest: (request: Request) => Promise<LocaleRequestResult>,
    handler: FetchHandler
  ): Promise<Response> {
    const result = await processRequest(request);

    if (result.action === "redirect") {
      const effective = CreateServerEntry.resolveEffectiveConfig(
        request,
        config
      );
      return CreateServerEntry.handleRedirect(result, effective);
    }

    if (result.action === "sync-cookie") {
      const effective = CreateServerEntry.resolveEffectiveConfig(
        request,
        config
      );
      return CreateServerEntry.handleSyncCookie(
        request,
        handler,
        result,
        effective
      );
    }

    if (result.action === "detect") {
      return CreateServerEntry.handleDetect(request, handler, result);
    }

    return handler(request);
  }

  /**
   * Merges override rules into effective {@link LocaleConfig} for cookie serialization.
   * Uses persist + infer match contexts — same as {@link ProcessRequest}.
   *
   * @see {@link AdapterChain.resolveEffective}
   */
  private static resolveEffectiveConfig(
    request: Request,
    config: LocaleConfig
  ): LocaleConfig {
    const pathname = new URL(request.url).pathname;
    return AdapterChain.resolveEffective(
      config.adapters,
      config,
      { pathname, config },
      { request, pathname, config }
    );
  }

  /**
   * Writes {@link AdapterChain.serializePersist} values as `Set-Cookie` headers.
   *
   * @see {@link AdapterChain.serializePersist}
   */
  private static applyPersistCookies(
    headers: Headers,
    locale: Locale,
    persist: PersistAdapter[]
  ): void {
    for (const value of AdapterChain.serializePersist(locale, persist)) {
      headers.append("Set-Cookie", value);
    }
  }

  /**
   * Short-circuits with redirect: `Location`, `status ?? {@link LOCALE_REDIRECT_STATUS}`,
   * and persist cookies from the effective {@link LocaleConfig.persist} chain.
   */
  private static handleRedirect(
    result: Extract<LocaleRequestResult, { action: "redirect" }>,
    effective: LocaleConfig
  ): Response {
    const headers = new Headers();
    headers.set("Location", result.redirectUrl);
    CreateServerEntry.applyPersistCookies(
      headers,
      result.locale,
      effective.persist
    );

    return new Response(null, {
      status: result.status ?? LOCALE_REDIRECT_STATUS,
      headers,
    });
  }

  /**
   * Runs the app handler, clones response headers, then sets the detect locale header.
   * Does not write persist cookies — user has not chosen locale yet.
   */
  private static handleDetect(
    request: Request,
    handler: FetchHandler,
    result: Extract<LocaleRequestResult, { action: "detect" }>
  ): Promisable<Response> {
    request.headers.set(result.detectedLocaleHeader, result.detectedLocale);
    return handler(request);
  }

  /**
   * Runs the app handler, clones response headers, then appends persist cookies
   * when URL locale and stored preference disagree.
   */
  private static async handleSyncCookie(
    request: Request,
    handler: FetchHandler,
    result: Extract<LocaleRequestResult, { action: "sync-cookie" }>,
    effective: LocaleConfig
  ): Promise<Response> {
    const response = await handler(request);
    const headers = new Headers(response.headers);
    CreateServerEntry.applyPersistCookies(
      headers,
      result.locale,
      effective.persist
    );

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
}
