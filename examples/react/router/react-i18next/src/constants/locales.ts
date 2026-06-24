export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English",
  ar: "العربية",
};

export const LOCALE_TEXT_DIRECTION = {
  en: "ltr",
  ar: "rtl",
} as const satisfies Record<SupportedLocale, "ltr" | "rtl">;

export function isValidLocale(
  value: string | undefined
): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value ?? "");
}
