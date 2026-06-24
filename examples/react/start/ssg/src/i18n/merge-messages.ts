import type { LocaleMessageModules, Messages } from "@/types/i18n";

export function mergeMessages(m: LocaleMessageModules): Messages {
  return {
    Common: m.common,
    Landing: m.landing,
  };
}
