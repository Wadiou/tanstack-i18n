/** config — LocaleConfig validation at define vs bind. */
import { LocaleConfigError } from "../errors.js";
import { isNeverPrefix } from "../routing/prefix-mode.js";
import type {
  DefineLocaleInput,
  InferAdapter,
  LocaleConfig,
  LocalePrefix,
  PersistAdapter,
} from "../types.js";

/** Detects mistaken `write` on infer adapters (infer must be read-only). */
function hasWriteProperty(adapter: InferAdapter): boolean {
  return "write" in adapter && adapter.write !== undefined;
}

/** Validates {@link DefineLocaleInput} at define time and {@link LocaleConfig} at runtime bind. */
export class LocaleConfigValidator {
  /**
   * Runs at `defineLocaleConfig`: non-empty locales, default in list.
   *
   * @param input - Raw config before normalization
   */
  static validateInput(input: DefineLocaleInput): void {
    LocaleConfigValidator.assertNonEmptyLocales(input.locales);
    LocaleConfigValidator.assertDefaultInLocales(
      input.locales,
      input.defaultLocale
    );
  }

  /**
   * Runs at `createLocaleRuntime`: resolution fallback, never-prefix persist, unique ids, infer read-only.
   *
   * @param locale - Config to validate before binding handlers
   */
  static validate(locale: LocaleConfig): void {
    LocaleConfigValidator.assertResolutionFallback(
      locale.persist,
      locale.infer
    );
    LocaleConfigValidator.assertNeverModePersistence(
      locale.url.prefix,
      locale.persist
    );
    LocaleConfigValidator.assertUniqueAdapterIds(locale.persist, locale.infer);
    LocaleConfigValidator.assertInferReadOnly(locale.infer);
  }

  /** Requires at least one non-blank locale string in `locales[]`. */
  private static assertNonEmptyLocales(locales: readonly string[]): void {
    if (locales.length === 0) {
      throw new LocaleConfigError(
        "locales must be non-empty",
        "Provide at least one locale in locales[]."
      );
    }
    for (const locale of locales) {
      if (!locale || locale.trim() === "") {
        throw new LocaleConfigError(
          "locale strings must be non-empty",
          "Use non-blank locale identifiers."
        );
      }
    }
  }

  /** Requires `defaultLocale` to appear in `locales[]`. */
  private static assertDefaultInLocales(
    locales: readonly string[],
    defaultLocale: string
  ): void {
    if (!locales.includes(defaultLocale)) {
      throw new LocaleConfigError(
        `defaultLocale "${defaultLocale}" must be in locales`,
        "Set defaultLocale to one of the locales array entries."
      );
    }
  }

  /** Requires at least one persist or infer adapter so resolution has a fallback path. */
  private static assertResolutionFallback(
    persist: PersistAdapter[],
    infer: InferAdapter[]
  ): void {
    if (persist.length === 0 && infer.length === 0) {
      throw new LocaleConfigError(
        "No locale resolution fallback",
        "Add persist[] adapters and/or infer[] adapters."
      );
    }
  }

  /** With `prefix: "never"`, URL locale never persists — requires a persist adapter. */
  private static assertNeverModePersistence(
    prefix: LocalePrefix,
    persist: PersistAdapter[]
  ): void {
    if (isNeverPrefix(prefix) && persist.length === 0) {
      throw new LocaleConfigError(
        'No persistence backend for prefix "never"',
        "Add cookie() or another persist adapter when url.prefix is never."
      );
    }
  }

  /** Enforces unique adapter ids and at most one `cookie:` persist adapter. */
  private static assertUniqueAdapterIds(
    persist: PersistAdapter[],
    infer: InferAdapter[]
  ): void {
    const ids = new Set<string>();
    const all = [...persist, ...infer];

    for (const adapter of all) {
      if (ids.has(adapter.id)) {
        throw new LocaleConfigError(
          `Duplicate adapter id "${adapter.id}"`,
          "Use unique adapter ids; for custom adapters pass custom({ id })."
        );
      }
      ids.add(adapter.id);
    }

    const cookieIds = persist
      .map((a) => a.id)
      .filter((id) => id.startsWith("cookie:"));
    if (cookieIds.length > 1) {
      throw new LocaleConfigError(
        "Single cookie identity required",
        "Use at most one cookie() adapter in persist[]."
      );
    }
  }

  /** Infer adapters must not define `write` — use persist[] for storage. */
  private static assertInferReadOnly(infer: InferAdapter[]): void {
    for (const adapter of infer) {
      if (hasWriteProperty(adapter)) {
        throw new LocaleConfigError(
          "Infer adapters are read-only",
          "Move writable adapters to persist[]."
        );
      }
    }
  }
}
