/** locale — membership guard for configured locale lists. */
import type { Locale } from "../types.js";

/**
 * Type guard: `value` is a non-null string listed in `locales`.
 * Used by `PathParser.extractLocale`, `CookieParser.readLocale`, and `AcceptLanguageParser.resolve`.
 */
export function hasLocale(
  value: string | null | undefined,
  locales: readonly Locale[]
): value is Locale {
  return value != null && locales.includes(value);
}
