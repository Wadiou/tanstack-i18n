import { DEFAULT_LOCAL_STORAGE_KEY } from "../constants.js";
import type { Locale, PersistAdapter, PersistRunContext } from "../types.js";
import type { LocalStorageOptions } from "./types.js";

export class LocalStorageAdapter {
  /**
   * Persist adapter factory — read/write from `window.localStorage`.
   * Adapter id: `localStorage:${key}`.
   */
  static create(opts: LocalStorageOptions = {}): PersistAdapter {
    const { key = DEFAULT_LOCAL_STORAGE_KEY } = opts;

    return {
      id: `localStorage:${key}`,
      read(ctx: PersistRunContext): Locale | null {
        if (ctx.runtime !== "client") {
          return null;
        }
        if (typeof window === "undefined") {
          return null;
        }

        try {
          const stored = window.localStorage.getItem(key);
          if (stored && ctx.locales.includes(stored)) {
            return stored;
          }
        } catch {
          // Ignore read errors (e.g. cross-origin restrictions or disabled localStorage)
        }
        return null;
      },
      write(locale: Locale, ctx: PersistRunContext): Promise<void> {
        if (ctx.runtime !== "client") {
          return Promise.resolve();
        }
        if (typeof window === "undefined") {
          return Promise.resolve();
        }

        try {
          window.localStorage.setItem(key, locale);
        } catch {
          // Ignore write errors (e.g. quota exceeded)
        }
        return Promise.resolve();
      },
    };
  }
}

/**
 * Persist adapter — purely client-side read/write via `window.localStorage`.
 */
export const localStorage = LocalStorageAdapter.create;
