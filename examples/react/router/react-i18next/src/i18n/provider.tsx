import { createLocaleProvider } from "@Wadiou/tanstack-i18n/react";
import { useTranslation } from "react-i18next";
import { locale } from "@/locale";

export function useLocale() {
  return useTranslation().i18n.language;
}

export const { LocaleProvider, useLocaleContext } = createLocaleProvider({
  runtime: locale,
  useLocale,
});
