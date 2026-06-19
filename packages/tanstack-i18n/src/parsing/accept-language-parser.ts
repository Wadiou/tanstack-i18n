/** parsing — Accept-Language header resolution. */
import { hasLocale } from "../locale/locale-validator.js";
import type { Locale } from "../types.js";

interface WeightedLocale {
  locale: Locale;
  quality: number;
}

/** Resolves Accept-Language to a configured locale; used by the `acceptLanguage()` infer adapter. */
export class AcceptLanguageParser {
  /**
   * Picks the best matching locale from an Accept-Language header.
   * Empty or missing header → null. Returns null when the best tag is `defaultLocale` (no infer redirect needed).
   * Otherwise returns the highest-q tag present in `locales` with q > 0.
   */
  static resolve(
    header: string | null | undefined,
    locales: readonly Locale[],
    defaultLocale: Locale
  ): Locale | null {
    if (!header?.trim()) {
      return null;
    }

    const ranked = AcceptLanguageParser.parseHeader(header, locales);
    const best = ranked.find((entry) => entry.quality > 0);

    if (!best || best.locale === defaultLocale) {
      return null;
    }

    return best.locale;
  }

  /**
   * Parses comma-separated language ranges with optional q-values.
   * Filters to configured locales via `hasLocale`; sorts by descending quality.
   */
  private static parseHeader(
    header: string,
    locales: readonly Locale[]
  ): WeightedLocale[] {
    const entries: WeightedLocale[] = [];

    for (const part of header.split(",")) {
      const [rawTag, ...params] = part.trim().split(";");
      const tag = AcceptLanguageParser.normalizeTag(rawTag ?? "");
      if (!hasLocale(tag, locales)) {
        continue;
      }

      let quality = 1;
      for (const param of params) {
        const [key, value] = param.trim().split("=");
        if (key?.toLowerCase() === "q") {
          const parsed = Number.parseFloat(value ?? "");
          if (!Number.isNaN(parsed)) {
            quality = parsed;
          }
        }
      }

      entries.push({ locale: tag, quality });
    }

    return entries.sort((a, b) => b.quality - a.quality);
  }

  /** Primary language subtag only — `en-US` → `en` for matching against configured locale codes. */
  private static normalizeTag(tag: string): string {
    return tag.trim().split("-")[0]?.toLowerCase() ?? "";
  }
}
