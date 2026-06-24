import type { SupportedLocale } from "@/constants/locales";
import type enCommon from "@/messages/en/common.json";
import type enLanding from "@/messages/en/landing.json";

export interface Messages {
  Common: typeof enCommon;
  Landing: typeof enLanding;
}

export type LocaleMessageModules = {
  [K in keyof Messages as Lowercase<K>]: Messages[K];
};

declare module "use-intl" {
  interface AppConfig {
    Locale: SupportedLocale;
    Messages: Messages;
  }
}
