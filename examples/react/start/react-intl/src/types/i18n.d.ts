import type enCommon from "@/messages/en/common.json";
import type enLanding from "@/messages/en/landing.json";

export type Messages = Record<
  | `Common.${keyof typeof enCommon & string}`
  | `Landing.${keyof typeof enLanding & string}`,
  string
>;

declare global {
  // biome-ignore lint/style/noNamespace: FormatJS requires global namespace merging to type-check message IDs
  namespace FormatjsIntl {
    interface Message {
      ids: keyof Messages;
    }
  }
}
