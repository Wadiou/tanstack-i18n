import { createLocaleProvider } from "@wadiou/tanstack-i18n/solid";
import { locale } from "@/locale";
import { useLocale } from "./use-locale";

export const { LocaleProvider, useLocaleContext } = createLocaleProvider({
  runtime: locale,
  useLocale,
});
