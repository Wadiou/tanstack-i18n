import { createLocaleProvider } from "@wadiou/tanstack-i18n/react";
import { useLocale } from "use-intl";
import { locale } from "@/locale";

export const { LocaleProvider, useLocaleContext } = createLocaleProvider({
  runtime: locale,
  useLocale,
});
