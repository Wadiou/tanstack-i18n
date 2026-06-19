import { DEFAULT_COOKIE_NAME } from "../constants.js";
import { CookieParser } from "../parsing/cookie-parser.js";
import type { Locale, PersistAdapter, PersistRunContext } from "../types.js";
import type { CookieOptions } from "./types.js";

const DEFAULT_MAX_AGE = 31_536_000;
const DEFAULT_PATH = "/";
const DEFAULT_SAME_SITE = "lax";

function getClientCookieHeader(): string {
  if (typeof document === "undefined") {
    return "";
  }

  return document.cookie;
}

export class CookieAdapter {
  /**
   * Persist adapter factory — read from header/document, client write, `serialize` for Set-Cookie.
   * Adapter id: `cookie:${name}`.
   */
  static create(opts: CookieOptions = {}): PersistAdapter {
    const {
      name = DEFAULT_COOKIE_NAME,
      path = DEFAULT_PATH,
      maxAge = DEFAULT_MAX_AGE,
      sameSite = DEFAULT_SAME_SITE,
    } = opts;

    return {
      id: `cookie:${name}`,
      read(ctx: PersistRunContext): Locale | null {
        // 1. Client: document.cookie — server: Cookie header from middleware
        const header =
          ctx.runtime === "client"
            ? getClientCookieHeader()
            : (ctx.cookieHeader ?? "");

        return CookieParser.readLocale(header, name, ctx.locales);
      },
      async write(locale: Locale, ctx: PersistRunContext): Promise<void> {
        // Server persist writes happen via Set-Cookie on redirect/sync-cookie — not here
        if (ctx.runtime !== "client") {
          return;
        }

        // 2. Prefer Cookie Store API when available
        if (typeof window !== "undefined" && "cookieStore" in window) {
          await cookieStore.set({
            name,
            value: locale,
            path,
            expires: Date.now() + maxAge * 1000,
            sameSite,
          });
          return;
        }

        // 3. Fallback: document.cookie assignment
        if (typeof document !== "undefined") {
          // biome-ignore lint/suspicious/noDocumentCookie: fallback when Cookie Store API is unavailable
          document.cookie = `${name}=${encodeURIComponent(locale)};path=${path};max-age=${maxAge};samesite=${sameSite}`;
        }
      },
      serialize(locale: Locale): string {
        return [
          `${name}=${encodeURIComponent(locale)}`,
          `Path=${path}`,
          `Max-Age=${maxAge}`,
          `SameSite=${sameSite}`,
        ].join("; ");
      },
    };
  }
}

/**
 * Persist adapter — client write via Cookie Store / `document.cookie`; server read from cookie header.
 */
export const cookie = CookieAdapter.create;
