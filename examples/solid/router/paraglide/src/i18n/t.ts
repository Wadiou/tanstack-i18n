import { type Accessor, createMemo } from "solid-js";
import { useLocaleContext } from "./provider";

export function t<T>(fn: () => T): Accessor<T> {
  const ctx = useLocaleContext();
  const readLocale = () => ctx.locale;
  return createMemo(() => {
    readLocale();
    return fn();
  });
}
