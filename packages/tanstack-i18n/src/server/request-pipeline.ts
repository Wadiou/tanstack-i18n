/** server — explicit locale middleware steps. */
import { DEFAULT_DETECTED_LOCALE_HEADER } from "../constants.js";
import { RunContextBuilder } from "../context/run-context.js";
import { AdapterChain } from "../resolution/adapter-chain.js";
import { type PathnameKind, PathParser } from "../routing/path-parser.js";
import { UrlRewriter } from "../routing/url-rewrite.js";
import type { LocaleConfig, LocaleRequestResult } from "../types.js";

/**
 * Immutable inputs for one {@link RequestPipeline} pass — built by `ProcessRequest`.
 *
 * - `kind` — {@link PathParser.classify} on `pathname` and effective config
 * - `config` — override-merged {@link LocaleConfig} for this request
 */
export interface PipelineState {
  /** Effective config for this request (persist/infer/firstVisit overrides merged). */
  config: LocaleConfig;
  /** Raw `Cookie` header value when present. */
  cookieHeader: string | undefined;
  /** {@link PathParser.classify} result for {@link pathname}. */
  kind: PathnameKind;
  /** `url.pathname` — used for classification and override matching. */
  pathname: string;
  /** Incoming fetch request. */
  request: Request;
  /** Parsed request URL. */
  url: URL;
}

/**
 * Ordered locale middleware steps for {@link ProcessRequest}.
 *
 * 1. {@link RequestPipeline.checkIgnored} — pass through ignored paths
 * 2. {@link RequestPipeline.checkCanonicalStrip} — 301 strip wrong prefix shape
 * 3. {@link RequestPipeline.checkPrefixedSync} — sync cookie when URL locale ≠ persist
 * 4. {@link RequestPipeline.resolveUnprefixed} — GET redirect / sync-cookie / detect / pass
 *
 * @see `ProcessRequest`
 */
export class RequestPipeline {
  /**
   * Runs the pipeline in order; returns on the first step that produces a result.
   *
   * @see {@link RequestPipeline.checkIgnored}
   * @see {@link RequestPipeline.checkCanonicalStrip}
   * @see {@link RequestPipeline.checkPrefixedSync}
   * @see {@link RequestPipeline.resolveUnprefixed}
   */
  static async run(state: PipelineState): Promise<LocaleRequestResult> {
    const ignored = RequestPipeline.checkIgnored(state);
    if (ignored) {
      return ignored;
    }

    const strip = RequestPipeline.checkCanonicalStrip(state);
    if (strip) {
      return strip;
    }

    const prefixed = await RequestPipeline.checkPrefixedSync(state);
    if (prefixed) {
      return prefixed;
    }

    return RequestPipeline.resolveUnprefixed(state);
  }

  /** Passes through when {@link PathParser.classify} returned `ignored`. */
  static checkIgnored(state: PipelineState): LocaleRequestResult | null {
    if (state.kind === "ignored") {
      return { action: "pass" };
    }
    return null;
  }

  /**
   * Returns a 301 redirect when the URL has a prefix that should be stripped
   * (`never`, `as-needed` + default locale, or ignored path after strip).
   *
   * @see {@link UrlRewriter.resolvePrefixStripRedirect}
   */
  static checkCanonicalStrip(state: PipelineState): LocaleRequestResult | null {
    const canonical = UrlRewriter.resolvePrefixStripRedirect(
      state.url,
      state.config,
      state.kind as Exclude<PathnameKind, "ignored">
    );
    if (!canonical) {
      return null;
    }

    return {
      action: "redirect",
      redirectUrl: canonical.redirectUrl,
      locale: canonical.locale,
      status: canonical.status,
    };
  }

  /**
   * Prefixed URLs: sync persist cookie when URL locale disagrees with stored preference;
   * otherwise pass. Skipped when pathname has no locale segment.
   *
   * @see {@link AdapterChain.runPersist}
   * @see {@link PathParser.resolveUrlLocale}
   */
  static async checkPrefixedSync(
    state: PipelineState
  ): Promise<LocaleRequestResult | null> {
    const urlLocale = PathParser.resolveUrlLocale(state.pathname, state.config);
    if (!urlLocale) {
      return null;
    }

    const persistCtx = RunContextBuilder.buildPersist({
      runtime: "server",
      pathname: state.pathname,
      config: state.config,
      request: state.request,
      cookieHeader: state.cookieHeader,
    });
    const cookieLocale = await AdapterChain.runPersist(
      state.config.persist,
      persistCtx
    );

    // URL locale is source of truth on prefixed paths — sync cookie when persist disagrees
    if (cookieLocale !== urlLocale) {
      return { action: "sync-cookie", locale: urlLocale };
    }

    return { action: "pass" };
  }

  /**
   * Unprefixed URLs: non-GET passes; GET resolves target via persist + infer, then
   * {@link UrlRewriter.resolveLocalizeAction} on the request URL.
   *
   * @see {@link AdapterChain.resolveTarget}
   * @see {@link UrlRewriter.resolveLocalizeAction}
   */
  static async resolveUnprefixed(
    state: PipelineState
  ): Promise<LocaleRequestResult> {
    if (state.request.method !== "GET") {
      return { action: "pass" };
    }

    const persistCtx = RunContextBuilder.buildPersist({
      runtime: "server",
      pathname: state.pathname,
      config: state.config,
      request: state.request,
      cookieHeader: state.cookieHeader,
    });
    const inferCtx = RunContextBuilder.buildInfer({
      request: state.request,
      pathname: state.pathname,
      config: state.config,
      cookieHeader: state.cookieHeader,
    });
    const { target, persist } = await AdapterChain.resolveTarget(
      state.request,
      persistCtx,
      inferCtx,
      state.config
    );

    // Detect gate — runs before redirect/sync-cookie when firstVisit.mode is "detect"
    const firstVisit = state.config.firstVisit;
    const activeLocale = persist ?? state.config.defaultLocale;
    const detectedLocale =
      persist === null && target !== activeLocale ? target : null;
    const localized = UrlRewriter.localize(state.url, target, state.config);

    // 1. mode detect  2. infer differs from active  3. URL would change if redirected
    if (
      firstVisit.mode === "detect" &&
      detectedLocale !== null &&
      localized.pathname !== state.url.pathname
    ) {
      return {
        action: "detect",
        activeLocale,
        detectedLocale,
        detectedLocaleHeader:
          firstVisit.detectedLocaleHeader ?? DEFAULT_DETECTED_LOCALE_HEADER,
      };
    }

    return UrlRewriter.resolveLocalizeAction(
      state.url,
      target,
      persist,
      state.config
    );
  }
}
