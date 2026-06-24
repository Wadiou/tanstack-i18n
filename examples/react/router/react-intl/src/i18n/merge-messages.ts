import type { LocaleMessageModules, Messages } from "@/types/i18n";
import { flattenMessages } from "./flat-messages";

export function mergeMessages(m: LocaleMessageModules): Messages {
  return {
    ...flattenMessages(m.common, "Common"),
    ...flattenMessages(m.landing, "Landing"),
  } as Messages;
}
