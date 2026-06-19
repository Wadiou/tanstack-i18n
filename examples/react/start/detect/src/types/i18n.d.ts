import type { SupportedLocale } from "@/constants/locales";
import type enCommon from "@/messages/en/common.json";
import type enLanding from "@/messages/en/landing.json";

export interface Messages {
  Common: typeof enCommon;
  Landing: typeof enLanding;
}

declare module "use-intl" {
  interface AppConfig {
    Locale: SupportedLocale;
    Messages: Messages;
  }
}
