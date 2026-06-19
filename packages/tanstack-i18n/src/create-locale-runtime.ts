import { LocaleConfigValidator } from "./config/locale-config-validator.js";
import { ChangeLocale } from "./resolution/change-locale.js";
import { LocaleResolver } from "./resolution/locale-resolver.js";
import { UrlRewriter } from "./routing/url-rewrite.js";
import { CreateServerEntry } from "./server/create-server-entry.js";
import type { LocaleConfig, LocaleRuntime } from "./types.js";

/**
 * Binds a {@link LocaleConfig} to {@link LocaleRuntime} handlers.
 * Validates config at bind time via {@link LocaleConfigValidator.validate}.
 *
 * @param config - Config from `defineLocaleConfig`
 * @returns Runtime with `getLocale`, URL helpers, `createServerEntry`, and `changeLocale`
 *
 * @example
 * const config = defineLocaleConfig({ ... })
 * const runtime = createLocaleRuntime(config)
 * await runtime.getLocale({ request }) // server SSR
 */
export function createLocaleRuntime<
  TConfig extends LocaleConfig,
  TLocales extends string = TConfig["locales"][number],
>(config: TConfig): LocaleRuntime<TLocales> {
  LocaleConfigValidator.validate(config);

  const getLocale = LocaleResolver.createBound(config);
  const { deLocalizeUrl, localizeUrl } = UrlRewriter.createBound(config);

  return {
    config,
    getLocale,
    deLocalizeUrl,
    localizeUrl,
    changeLocale: ChangeLocale.createBound(config, getLocale),
    createServerEntry: CreateServerEntry.createBound(config),
  } as unknown as LocaleRuntime<TLocales>;
}
