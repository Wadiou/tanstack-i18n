import type { SupportedLocale } from "@/constants/locales";
import { Route } from "@/routes/__root";

export function useLocale(): SupportedLocale {
  return Route.useRouteContext().locale;
}
