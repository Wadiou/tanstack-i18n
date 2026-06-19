export const SUPPORTED_LOCALES = ["zh", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "zh";

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  zh: "简体中文",
  en: "English",
};

export const LOCALE_TEXT_DIRECTION = {
  zh: "ltr",
  en: "ltr",
} as const satisfies Record<SupportedLocale, "ltr" | "rtl">;

export function isValidLocale(
  value: string | undefined
): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value ?? "");
}
