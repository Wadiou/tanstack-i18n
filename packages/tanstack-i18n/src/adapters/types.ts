import type { Locale, PersistRunContext } from "../types.js";

/** Options for `localStorage` persist adapter. */
export interface LocalStorageOptions {
  /** LocalStorage key storing the locale code — default `"LOCALE"`. */
  key?: string;
}

/** Options for `cookie` persist adapter. */
export interface CookieOptions {
  /** Cookie `Max-Age` in seconds — default 31_536_000 (~1 year). */
  maxAge?: number;
  /** Cookie name storing the locale code — default `"LOCALE"`. */
  name?: string;
  /** Cookie `Path` attribute — default `/`. */
  path?: string;
  /** Cookie `SameSite` attribute — default `"lax"`. */
  sameSite?: "lax" | "strict" | "none";
}

/** Server-side persist read callback for `serverFn`. */
export type ServerFnRead = (
  ctx: PersistRunContext
) => Locale | null | Promise<Locale | null>;

/** Server-side persist write callback for `serverFn`. */
export type ServerFnWrite = (
  locale: Locale,
  ctx: PersistRunContext
) => void | Promise<void>;

/** Callback pair for `serverFn` persist adapter. */
export interface ServerFnOptions {
  /** Read stored locale on server — client reads return null. */
  read: ServerFnRead;
  /** Persist locale on server (and optionally client if invoked there). */
  write: ServerFnWrite;
}
