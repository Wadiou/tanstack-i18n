/** routing — LocalePrefix mode predicates. */
import type { LocalePrefix } from "../types.js";

/** True when {@link LocalePrefix} is `"never"` — no locale segments in URLs. */
export function isNeverPrefix(prefix: LocalePrefix): boolean {
  return prefix === "never";
}

/** True when {@link LocalePrefix} is `"as-needed"` — default locale omits prefix. */
export function isAsNeededPrefix(prefix: LocalePrefix): boolean {
  return prefix === "as-needed";
}

/** True when {@link LocalePrefix} is `"always"` — every localized URL has a segment. */
export function isAlwaysPrefix(prefix: LocalePrefix): boolean {
  return prefix === "always";
}
