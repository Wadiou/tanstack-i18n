import type enCommon from "@/messages/en/common.json";
import type enLanding from "@/messages/en/landing.json";

export interface LocaleMessageModules {
  common: typeof enCommon;
  landing: typeof enLanding;
}

export interface Messages {
  common: typeof enCommon;
  landing: typeof enLanding;
}

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof enCommon;
      landing: typeof enLanding;
    };
  }
}
