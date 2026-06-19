/** parsing — Cookie header value extraction. */
import { hasLocale } from "../locale/locale-validator.js";
import type { Locale } from "../types.js";

/** Parses Cookie header values; used by the `cookie()` persist adapter. */
export class CookieParser {
  /**
   * Extracts a named cookie value from a raw Cookie header string.
   * Scans semicolon-separated pairs for an exact name match.
   * Returns null for empty headers, missing names, or segments without `=`.
   */
  static parseValue(cookieHeader: string, name: string): string | null {
    if (!cookieHeader) {
      return null;
    }

    for (const part of cookieHeader.split(";")) {
      const trimmed = part.trim();
      const separator = trimmed.indexOf("=");
      if (separator === -1) {
        continue;
      }

      const key = trimmed.slice(0, separator);
      if (key === name) {
        return trimmed.slice(separator + 1);
      }
    }

    return null;
  }

  /**
   * Reads a locale code from a cookie header by name.
   * Decodes with `decodeURIComponent` when valid; falls back to raw value on decode failure.
   * Returns null when absent or not in the configured list (`hasLocale`).
   */
  static readLocale(
    header: string | undefined,
    name: string,
    locales: readonly Locale[]
  ): Locale | null {
    const raw = CookieParser.parseValue(header ?? "", name);
    if (!raw) {
      return null;
    }

    try {
      const decoded = decodeURIComponent(raw);
      return hasLocale(decoded, locales) ? decoded : null;
    } catch {
      return hasLocale(raw, locales) ? raw : null;
    }
  }
}
