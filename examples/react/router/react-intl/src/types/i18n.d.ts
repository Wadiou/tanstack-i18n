import type enCommon from "@/messages/en/common.json";
import type enLanding from "@/messages/en/landing.json";

export interface LocaleMessageModules {
  common: typeof enCommon;
  landing: typeof enLanding;
}

/**
 * Recursively flattens an object type into dot-separated key paths.
 *
 * @example
 * // { nav: { homeLink: string }; hero: string }
 * // produces: "nav.homeLink" | "hero"
 */
type FlattenKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? FlattenKeys<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

export type Messages = {
  [K in keyof LocaleMessageModules as FlattenKeys<
    LocaleMessageModules[K],
    `${Capitalize<K & string>}.`
  >]: string;
};

declare global {
  // biome-ignore lint/style/noNamespace: FormatJS requires global namespace merging to type-check message IDs
  namespace FormatjsIntl {
    interface Message {
      ids: keyof Messages;
    }
  }
}
