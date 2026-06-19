import { packageErrorPrefix } from "./constants.js";

/**
 * Configuration validation error thrown by `LocaleConfigValidator`.
 * {@link Error.message} is prefixed with the package name.
 * Optional {@link LocaleConfigError.hint} carries a remediation message.
 */
export class LocaleConfigError extends Error {
  /** Suggested fix when validation fails (shown in dev tooling). */
  readonly hint?: string;

  /**
   * @param message - Primary validation error (without package prefix)
   * @param hint - Optional remediation hint
   */
  constructor(message: string, hint?: string) {
    super(packageErrorPrefix(message));
    this.name = "LocaleConfigError";
    this.hint = hint;
  }
}

/**
 * Runtime misuse error (e.g. `LocaleRuntime.changeLocale` on the server).
 * {@link Error.message} is prefixed with the package name.
 */
export class LocaleRuntimeError extends Error {
  /**
   * @param message - Primary error detail (without package prefix)
   */
  constructor(message: string) {
    super(packageErrorPrefix(message));
    this.name = "LocaleRuntimeError";
  }
}
