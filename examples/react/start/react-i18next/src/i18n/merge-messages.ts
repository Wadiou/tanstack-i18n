import type { LocaleMessageModules, Messages } from "@/types/i18n";

export function mergeMessages(m: LocaleMessageModules): Messages {
  return {
    common: m.common,
    landing: m.landing,
  };
}
