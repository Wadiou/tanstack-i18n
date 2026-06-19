import { createLocaleProvider } from "@Wadiou/tanstack-i18n/react";
import { locale } from "@/locale";
import { useLocale } from "./use-locale";

export const { LocaleProvider, useLocaleContext } = createLocaleProvider({
  runtime: locale,
  useLocale,
});
