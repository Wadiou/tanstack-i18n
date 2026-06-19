/** resolution — user-initiated locale switch; persist writes + URL update + router refresh. */
import { LocaleRuntimeError } from "../errors.js";
import { PathParser } from "../routing/path-parser.js";
import { UrlRewriter } from "../routing/url-rewrite.js";
import type {
  ChangeLocaleContext,
  Locale,
  LocaleConfig,
  LocaleReadContext,
  Promisable,
} from "../types.js";
import { AdapterChain } from "./adapter-chain.js";
import { LocaleResolver } from "./locale-resolver.js";

export class ChangeLocale {
  /** Returns a bound `changeLocale(next, ctx)` for `LocaleRuntime`. */
  static createBound(
    config: LocaleConfig,
    getLocale: (context?: LocaleReadContext) => Promisable<Locale>
  ): (next: Locale, ctx: ChangeLocaleContext) => Promise<void> {
    return (next, ctx) => ChangeLocale.handle(config, getLocale, next, ctx);
  }

  /**
   * 1. Require `window` — else throw
   * 2. No-op when `next` equals bound `getLocale`
   * 3. {@link LocaleResolver.preparePersistState} — same effective chain as getLocale
   * 4. {@link AdapterChain.writePersist}
   * 5. When path is not ignored: deLocalize → localize with base config, `history.replaceState`
   * 6. `ctx.router.invalidate()`
   */
  private static async handle(
    config: LocaleConfig,
    getLocale: (context?: LocaleReadContext) => Promisable<Locale>,
    next: Locale,
    ctx: ChangeLocaleContext
  ): Promise<void> {
    if (typeof window === "undefined") {
      throw new LocaleRuntimeError(
        "changeLocale requires a browser environment"
      );
    }

    if (next === (await getLocale())) {
      return;
    }

    const { pathname, effective, persistCtx } =
      LocaleResolver.preparePersistState(config);

    await AdapterChain.writePersist(effective.persist, next, persistCtx);

    if (!PathParser.shouldIgnore(pathname, effective.url)) {
      const currentUrl = new URL(window.location.href);
      const localized = UrlRewriter.localize(
        UrlRewriter.deLocalize(currentUrl, config),
        next,
        config
      );
      window.history.replaceState(
        null,
        "",
        `${localized.pathname}${localized.search}${localized.hash}`
      );
    }

    await ctx.router.invalidate();
  }
}
