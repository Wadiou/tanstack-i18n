import { AcceptLanguageParser } from "../parsing/accept-language-parser.js";
import type { InferAdapter, InferRunContext } from "../types.js";

export class AcceptLanguageAdapter {
  /**
   * Infer adapter factory — resolves locale from `Accept-Language` header.
   * Adapter id: `accept-language`.
   */
  static create(): InferAdapter {
    return {
      id: "accept-language",
      read(ctx: InferRunContext) {
        return AcceptLanguageParser.resolve(
          ctx.request.headers.get("accept-language"),
          ctx.locales,
          ctx.defaultLocale
        );
      },
    };
  }
}

/**
 * Infer adapter — `Accept-Language` on unprefixed GET (request middleware).
 */
export const acceptLanguage = AcceptLanguageAdapter.create;
