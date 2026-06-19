/** React adapter — createLocaleProvider. */

import { useRouter } from "@tanstack/react-router";
import { createContext, type ReactNode, useCallback, useContext } from "react";

import type { Locale, LocaleRuntime } from "../types.js";

/** Value exposed by {@link useLocaleContext}. */
export interface LocaleContextValue<TLocales extends string = Locale> {
  /** Default locale from {@link LocaleRuntime.config}. */
  defaultLocale: TLocales;
  /** Active locale from app `useLocale` hook. */
  locale: TLocales;
  /** Configured locale codes from {@link LocaleRuntime.config}. */
  locales: readonly TLocales[];
  /** User-initiated switch — persist, URL, and router invalidate. */
  setLocale: (locale: TLocales) => Promise<void>;
}

/** Dependencies for {@link createLocaleProvider}. */
export interface CreateLocaleProviderDeps<TLocales extends string> {
  /** Bound runtime from `createLocaleRuntime`. */
  runtime: LocaleRuntime<TLocales>;
  /** App hook to read active locale — use-intl, route context, or any message library. */
  useLocale: () => TLocales;
}

/**
 * Creates React context provider and hook for locale switching.
 *
 * @param deps - Runtime and app locale reader
 * @returns `{ LocaleProvider, useLocaleContext }`
 */
export function createLocaleProvider<TLocales extends string>(
  deps: CreateLocaleProviderDeps<TLocales>
) {
  const LocaleContext = createContext<LocaleContextValue<TLocales> | undefined>(
    undefined
  );

  function LocaleProvider({ children }: { children: ReactNode }) {
    const locale = deps.useLocale();
    const router = useRouter();
    const { config, changeLocale } = deps.runtime;

    const setLocale = useCallback(
      (nextLocale: TLocales) => {
        if (nextLocale === locale) {
          return Promise.resolve();
        }
        return changeLocale(nextLocale, { router });
      },
      [locale, router, changeLocale]
    );

    return (
      <LocaleContext.Provider
        value={{
          locale,
          locales: config.locales as unknown as readonly TLocales[],
          defaultLocale: config.defaultLocale as TLocales,
          setLocale,
        }}
      >
        {children}
      </LocaleContext.Provider>
    );
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
