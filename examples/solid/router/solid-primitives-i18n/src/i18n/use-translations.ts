import type {
  Flatten,
  Scoped,
  Scopes,
  Translator,
} from "@solid-primitives/i18n";
import {
  resolveTemplate,
  scopedTranslator,
  translator,
} from "@solid-primitives/i18n";
import { Route } from "@/routes/__root";

import type enCommon from "../../messages/en/common.json";
import type enLanding from "../../messages/en/landing.json";

export interface Messages {
  Common: typeof enCommon;
  Landing: typeof enLanding;
}

export type FlatMessages = Flatten<{ [K in keyof Messages]: Messages[K] }>;

export function useTranslations<
  TNamespace extends
    | Scopes<keyof FlatMessages & string>
    | undefined = undefined,
>(
  namespace?: TNamespace
): Translator<
  TNamespace extends string ? Scoped<FlatMessages, TNamespace> : FlatMessages
> {
  const context = Route.useRouteContext();
  const t = translator(
    () => context().messages as unknown as FlatMessages,
    resolveTemplate
  );

  type ReturnType = Translator<
    TNamespace extends string ? Scoped<FlatMessages, TNamespace> : FlatMessages
  >;

  if (namespace) {
    return scopedTranslator(t, namespace) as unknown as ReturnType;
  }
  return t as unknown as ReturnType;
}
