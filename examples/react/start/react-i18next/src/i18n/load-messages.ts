import type { SupportedLocale } from "@/constants/locales";
import type { Messages } from "@/types/i18n";

const loaders = {
  en: () => import("./locales/en"),
  ar: () => import("./locales/ar"),
} as const satisfies Record<
  SupportedLocale,
  () => Promise<{ default: Messages }>
>;

export async function loadMessages(locale: SupportedLocale): Promise<Messages> {
  const { default: messages } = await loaders[locale]();
  return messages;
}
