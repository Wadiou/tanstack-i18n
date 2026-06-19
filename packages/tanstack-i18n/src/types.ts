/** Shared types for locale config, adapters, middleware, and {@link LocaleRuntime}. */

/** Value or `null`. */
export type Nullable<T> = T | null;

/** Synchronous value or a Promise of the same. */
export type Promisable<T> = T | Promise<T>;

/** BCP 47-style locale code (e.g. `"en"`) configured in {@link DefineLocaleInput.locales}. */
export type Locale = string;

/**
 * URL prefix mode or per-locale segment map.
 * - `"always"` — every localized URL includes a locale segment
 * - `"as-needed"` — default locale omits prefix; others include it
 * - `"never"` — no locale prefix in URLs
 * - `Record<Locale, string>` — custom path segment per locale
 */
export type LocalePrefix =
  | "always"
  | "as-needed"
  | "never"
  | Record<Locale, string>;

/** HTTP routing and TanStack Router route-id options. */
export interface LocaleUrlConfig {
  /** Paths excluded from locale middleware (RegExp or predicate). */
  ignoredPaths?: RegExp | ((pathname: string) => boolean);
  /** How locale segments appear in HTTP pathnames — see {@link LocalePrefix}. */
  prefix: LocalePrefix;
  /** TanStack Router route-id prefix only (e.g. `{-$locale}`) — not used for HTTP pathname parsing. */
  segment?: string;
}

/** Run context passed to {@link PersistAdapter} `read` / `write`. */
export interface PersistRunContext {
  /** Raw `Cookie` header on server reads. */
  cookieHeader?: string;
  /** Fallback when no adapter returns a locale. */
  defaultLocale: Locale;
  /** Configured locale codes. */
  locales: readonly Locale[];
  /** Request pathname used for override matching. */
  pathname: string;
  /** Full request — available on server persist reads. */
  request?: Request;
  /** `"server"` in middleware / SSR; `"client"` in browser persist writes. */
  runtime: "server" | "client";
}

/** Run context passed to {@link InferAdapter} `read` (unprefixed GET only). */
export interface InferRunContext {
  /** Raw `Cookie` header — optional for infer adapters. */
  cookieHeader?: string;
  /** Fallback when infer returns null. */
  defaultLocale: Locale;
  /** Configured locale codes. */
  locales: readonly Locale[];
  /** Request pathname used for override matching. */
  pathname: string;
  /** Incoming request — infer adapters read headers from here. */
  request: Request;
}

/** Stored locale preference adapter (cookie, server function, etc.). */
export interface PersistAdapter {
  /** Stable id for debugging and adapter ordering. */
  id: string;
  /** Returns stored locale or `null` when this adapter has no value. */
  read(ctx: PersistRunContext): Promisable<Nullable<Locale>>;
  /** Optional `Set-Cookie` fragment for redirect / sync-cookie responses. */
  serialize?(locale: Locale): string;
  /** Persists locale — typically client-only for cookie adapters. */
  write(locale: Locale, ctx: PersistRunContext): Promise<void>;
}

/**
 * Unprefixed first GET behavior.
 * - `"redirect"` — localize URL and redirect when infer differs from active locale
 * - `"detect"` — return {@link LocaleRequestResult} `detect` for banner UX (no redirect)
 */
export type FirstVisitMode = "redirect" | "detect";

/** Global `firstVisit` block on {@link LocaleConfig}. */
export interface FirstVisitConfig {
  /** Response header name when {@link LocaleRequestResult} action is `"detect"`. */
  detectedLocaleHeader?: string;
  /** Redirect (default) or detect on unprefixed GET — see {@link FirstVisitMode}. */
  mode: FirstVisitMode;
}

/** First-visit locale inference adapter (e.g. `Accept-Language`). */
export interface InferAdapter {
  /** Stable id for debugging and adapter ordering. */
  id: string;
  /** Returns inferred locale or `null` — used only in request middleware. */
  read(ctx: InferRunContext): Nullable<Locale>;
}

/** Input to persist override `match` — no `Request` (pathname + config only). */
export interface PersistMatchContext {
  /** Effective or base {@link LocaleConfig}. */
  config: LocaleConfig;
  /** Request pathname. */
  pathname: string;
}

/** Input to infer and firstVisit override `match`. */
export interface InferMatchContext {
  /** Effective or base {@link LocaleConfig}. */
  config: LocaleConfig;
  /** Request pathname. */
  pathname: string;
  /** Incoming request. */
  request: Request;
}

/** Replaces the persist adapter chain when `match` returns true. */
export interface PersistOverrideRule {
  /** Predicate on {@link PersistMatchContext}. */
  match: (ctx: PersistMatchContext) => boolean;
  /** Adapter chain used when matched. */
  persist: PersistAdapter[];
  /** Discriminator — replace {@link LocaleAdapters.persist}. */
  target: "persist";
}

/** Replaces the infer adapter chain when `match` returns true (request middleware only). */
export interface InferOverrideRule {
  /** Adapter chain used when matched. */
  infer: InferAdapter[];
  /** Predicate on {@link InferMatchContext}. */
  match: (ctx: InferMatchContext) => boolean;
  /** Discriminator — replace {@link LocaleAdapters.infer}. */
  target: "infer";
}

/** Merges partial {@link FirstVisitConfig} over global when `match` returns true. */
export interface FirstVisitOverrideRule {
  /** Fields merged over global `firstVisit` (first matching rule wins). */
  firstVisit: Partial<FirstVisitConfig>;
  /** Predicate on {@link InferMatchContext}. */
  match: (ctx: InferMatchContext) => boolean;
  /** Discriminator — partial merge into effective `firstVisit`. */
  target: "firstVisit";
}

/** {@link PersistOverrideRule} | {@link InferOverrideRule} | {@link FirstVisitOverrideRule}. */
export type AdapterRule =
  | PersistOverrideRule
  | InferOverrideRule
  | FirstVisitOverrideRule;

/** Persist, infer, and per-request override rules. */
export interface LocaleAdapters {
  /** Ordered infer chain — first adapter that returns a locale wins (middleware only). */
  infer?: InferAdapter[];
  /** Path-scoped adapter / firstVisit overrides — array order is priority. */
  overrides?: AdapterRule[];
  /** Ordered persist chain — first adapter that returns a locale wins. */
  persist: PersistAdapter[];
}

/** Partial adapter chains accepted by `defineLocaleConfig`. */
export interface DefineLocaleAdaptersInput {
  /** Ordered infer chain — default `[]`. */
  infer?: InferAdapter[];
  /** Path-scoped overrides — default none. */
  overrides?: AdapterRule[];
  /** Ordered persist chain — default `[cookie()]`. */
  persist?: PersistAdapter[];
}

/** Input to locale config definition (`defineLocaleConfig`). */
export interface DefineLocaleInput {
  /** Persist, infer, and override adapter chains — default persist `[cookie()]`, infer `[]`. */
  adapters?: DefineLocaleAdaptersInput;
  /** Locale when URL and adapters yield nothing — must be in `locales`. */
  defaultLocale: Locale;
  /** Optional global first-visit mode — defaults to `{ mode: "redirect" }`. */
  firstVisit?: FirstVisitConfig;
  /** Supported locale codes. */
  locales: readonly Locale[];
  /** URL prefix, ignored paths, router segment — partial; prefix defaults to `"as-needed"`. */
  url?: Partial<LocaleUrlConfig>;
}

/**
 * Validated, normalized config returned by `defineLocaleConfig`.
 * Top-level `persist` / `infer` mirror {@link LocaleAdapters} for convenience.
 *
 * @typeParam T - Input shape passed to `defineLocaleConfig` (preserves locale literals)
 */
export type LocaleConfig<T extends DefineLocaleInput = DefineLocaleInput> =
  Readonly<{
    /** Supported locale codes (preserves literal types from input). */
    locales: T["locales"];
    /** Locale when URL and adapters yield nothing — must be in `locales`. */
    defaultLocale: T["defaultLocale"];
    /** Normalized URL routing options (`prefix`, `segment`, optional `ignoredPaths`). */
    url: LocaleUrlConfig;
    /** Normalized global first-visit behavior. */
    firstVisit: FirstVisitConfig;
    /** Normalized adapter chains (`infer` is always an array). */
    adapters: Readonly<LocaleAdapters & { infer: InferAdapter[] }>;
    /** Shorthand for `adapters.persist`. */
    persist: PersistAdapter[];
    /** Shorthand for `adapters.infer`. */
    infer: InferAdapter[];
  }>;

/** App fetch handler wrapped by `LocaleRuntime.createServerEntry`. */
export type FetchHandler = (request: Request) => Promisable<Response>;

/**
 * Outcome of request middleware (server entry wrapper).
 *
 * Variants:
 * - `"pass"` — forward to app handler unchanged
 * - `"redirect"` — HTTP redirect to localized URL + persist cookies
 * - `"sync-cookie"` — run handler, attach persist cookies without redirect
 * - `"detect"` — run handler, set detect header; no redirect or Set-Cookie
 */
export type LocaleRequestResult =
  | {
      /** Continue to app handler — no locale redirect or cookie sync. */
      action: "pass";
    }
  | {
      /** Redirect to `redirectUrl` with optional `status`. */
      action: "redirect";
      /** Absolute or origin-relative redirect target. */
      redirectUrl: string;
      /** Locale written to persist cookies on redirect. */
      locale: Locale;
      /** HTTP status — defaults to 307 when omitted. */
      status?: number;
    }
  | {
      /** Run handler; attach persist cookies for `locale`. */
      action: "sync-cookie";
      /** Locale serialized into Set-Cookie. */
      locale: Locale;
    }
  | {
      /** Banner UX — render in `activeLocale`, hint `detectedLocale` via header. */
      action: "detect";
      /** Locale for messages / `html lang` (persist or default). */
      activeLocale: Locale;
      /** Locale inferred from Accept-Language (or other infer adapter). */
      detectedLocale: Locale;
      /** Response header name — effective merged `firstVisit.detectedLocaleHeader`. */
      detectedLocaleHeader: string;
    };

/** Context passed to `LocaleRuntime.changeLocale`. */
export interface ChangeLocaleContext {
  router: {
    /** Invalidate router cache after locale switch (TanStack Router). */
    invalidate: () => Promise<void>;
  };
}

/** Required on server when calling {@link LocaleRuntime.getLocale}. Omit on the client. */
export interface LocaleReadContext {
  /** Incoming request — pathname and Cookie header are derived from this. */
  request: Request;
}

/**
 * Runtime bound to a {@link LocaleConfig}.
 * Created by `createLocaleRuntime`.
 */
export interface LocaleRuntime<TLocales extends string = Locale> {
  /** User-initiated locale switch — redirect, persist write, router invalidate. */
  changeLocale(next: TLocales, ctx: ChangeLocaleContext): Promise<void>;
  /** Locale configuration from `defineLocaleConfig`. */
  config: LocaleConfig;
  /** Wrap fetch handler with locale middleware, Set-Cookie, and detect headers. */
  createServerEntry(handler: FetchHandler): FetchHandler;
  /** Strip locale prefix from URL per prefix mode. */
  deLocalizeUrl(url: URL): URL;
  /** Active locale — URL segment, then persist chain, then default (no infer). */
  getLocale(context?: LocaleReadContext): Promisable<TLocales>;
  /** Add locale prefix; optional `locale` falls back to URL segment then default. */
  localizeUrl(url: URL, locale?: TLocales): URL;
}
