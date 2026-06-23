import type enCommon from "@/messages/en/common.json";
import type enLanding from "@/messages/en/landing.json";
import type { Messages } from "@/types/i18n";
import { flattenMessages } from "./flat-messages";

export interface LocaleMessageModules {
  common: typeof enCommon;
  landing: typeof enLanding;
}

export function mergeMessages(m: LocaleMessageModules): Messages {
  return {
    ...flattenMessages(m.common, "Common"),
    ...flattenMessages(m.landing, "Landing"),
  } as Messages;
}
