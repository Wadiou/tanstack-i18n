import { createLocaleRuntime } from "@wadiou/tanstack-i18n";
import { createStartLocaleHelpers } from "@wadiou/tanstack-i18n/react-start";
import type { SupportedLocale } from "./constants/locales";
import { config } from "./locale-config";

export const locale = createLocaleRuntime(config);

export const { getLocale, getDetectedLocale } =
  createStartLocaleHelpers<SupportedLocale>(locale, config);
