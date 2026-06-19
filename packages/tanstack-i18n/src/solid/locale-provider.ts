import { useRouter } from "@tanstack/solid-router";
import type { JSX } from "solid-js";
import {
  createComponent,
  createContext,
  createMemo,
  type ParentProps,
  useContext,
} from "solid-js";
import type { Locale, LocaleRuntime } from "../types.js";

export interface LocaleContextValue<TLocales extends string = Locale> {
  defaultLocale: TLocales;
  locale: TLocales;
  locales: readonly TLocales[];
  setLocale: (locale: TLocales) => Promise<void>;
}

export interface CreateLocaleProviderDeps<TLocales extends string> {
  runtime: LocaleRuntime<TLocales>;
  useLocale: () => TLocales;
}

export function createLocaleProvider<TLocales extends string>(
  deps: CreateLocaleProviderDeps<TLocales>
) {
  const LocaleContext = createContext<LocaleContextValue<TLocales>>();

  function LocaleProvider(props: ParentProps): JSX.Element {
    const router = useRouter();
    const { config, changeLocale } = deps.runtime;

    const activeLocale = createMemo(() => deps.useLocale());

    const setLocale = (nextLocale: TLocales): Promise<void> => {
      if (nextLocale === activeLocale()) {
        return Promise.resolve();
      }
      return changeLocale(nextLocale, { router });
    };

    return createComponent(LocaleContext.Provider, {
      value: {
        get locale() {
          return activeLocale();
        },
        locales: config.locales as unknown as readonly TLocales[],
        defaultLocale: config.defaultLocale as TLocales,
        setLocale,
      },
      get children() {
        return props.children;
      },
    });
  }

  function useLocaleContext(): LocaleContextValue<TLocales> {
    const context = useContext(LocaleContext);
    if (context === undefined) {
      throw new Error("useLocaleContext must be used within a LocaleProvider");
    }
    return context;
  }

  return { LocaleProvider, useLocaleContext };
}
