import { defineLocaleConfig } from "@wadiou/tanstack-i18n";
import { acceptLanguage, cookie } from "@wadiou/tanstack-i18n/adapters";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/constants/locales";

export const config = defineLocaleConfig({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  adapters: {
    persist: [cookie()],
    infer: [acceptLanguage()],
  },
  firstVisit: {
    mode: "detect",
  },
});
