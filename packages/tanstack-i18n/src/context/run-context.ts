/** context — run context builders; match contexts are `PersistMatchContext` / `InferMatchContext`. */
import { LocaleRuntimeError } from "../errors.js";
import type {
  InferRunContext,
  LocaleConfig,
  LocaleReadContext,
  PersistRunContext,
} from "../types.js";

/** Input to {@link RunContextBuilder.buildPersist}. */
export interface BuildPersistContextInput {
  /** Effective or base {@link LocaleConfig}. */
  config: LocaleConfig;
  /** Raw Cookie header — falls back to `request` on server. */
  cookieHeader?: string;
  /** Pathname for override matching. */
  pathname: string;
  /** Full request on server reads. */
  request?: Request;
  /** `"server"` in middleware; `"client"` in browser persist writes. */
  runtime: "server" | "client";
}

/** Input to {@link RunContextBuilder.buildInfer}. */
export interface BuildInferContextInput {
  /** Effective or base {@link LocaleConfig}. */
  config: LocaleConfig;
  /** Raw Cookie header — optional for infer adapters. */
  cookieHeader?: string;
  /** Pathname for override matching. */
  pathname: string;
  /** Incoming request — infer adapters read headers. */
  request: Request;
}

/** Builds {@link PersistRunContext} / {@link InferRunContext} for adapter chains. */
export class RunContextBuilder {
  /** `"client"` when `window` is defined, else `"server"`. */
  static getRuntime(): "server" | "client" {
    return typeof window === "undefined" ? "server" : "client";
  }

  /** Resolves pathname and request for a `LocaleRuntime.getLocale` read. */
  static resolveReadContext(context?: LocaleReadContext): {
    pathname: string;
    request?: Request;
  } {
    const runtime = RunContextBuilder.getRuntime();
    if (runtime === "client") {
      return { pathname: window.location.pathname };
    }

    if (!context?.request) {
      throw new LocaleRuntimeError(
        "getLocale requires { request } on the server — pass LocaleReadContext from your SSR entry or read-locale wrapper"
      );
    }

    return {
      pathname: new URL(context.request.url).pathname,
      request: context.request,
    };
  }

  /** Client pathname for `LocaleResolver.preparePersistState` (changeLocale). */
  static getClientPathname(): string {
    return window.location.pathname;
  }

  /** Assembles {@link PersistRunContext}; server cookie header from request when omitted. */
  static buildPersist(input: BuildPersistContextInput): PersistRunContext {
    const { runtime, pathname, config, request, cookieHeader } = input;

    return {
      runtime,
      pathname,
      locales: config.locales,
      defaultLocale: config.defaultLocale,
      request,
      cookieHeader:
        cookieHeader ??
        (runtime === "server"
          ? (request?.headers.get("cookie") ?? undefined)
          : undefined),
    };
  }

  /** Assembles {@link InferRunContext} from request + config. */
  static buildInfer(input: BuildInferContextInput): InferRunContext {
    const { request, pathname, config, cookieHeader } = input;

    return {
      request,
      pathname,
      locales: config.locales,
      defaultLocale: config.defaultLocale,
      cookieHeader: cookieHeader ?? request.headers.get("cookie") ?? undefined,
    };
  }
}
