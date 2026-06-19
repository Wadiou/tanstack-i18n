import { flatten } from "@solid-primitives/i18n";
import type { SupportedLocale } from "@/constants/locales";

export async function loadMessages(locale: SupportedLocale) {
  const [common, landing] = await Promise.all([
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/landing.json`),
  ]);

  return flatten({
    Common: common.default,
    Landing: landing.default,
  }) as Record<string, string>;
}
