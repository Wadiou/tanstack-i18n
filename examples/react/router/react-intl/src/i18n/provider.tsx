import { createLocaleProvider } from "@wadiou/tanstack-i18n/react";
import { useIntl } from "react-intl";
import { locale } from "@/locale";

export function useLocale() {
  return useIntl().locale;
}

export const { LocaleProvider, useLocaleContext } = createLocaleProvider({
  runtime: locale,
  useLocale,
});
