import type {
  Locale,
  PersistAdapter,
  PersistRunContext,
  Promisable,
} from "../types.js";
import type { ServerFnOptions } from "./types.js";

export class ServerFnAdapter {
  /**
   * Persist adapter factory — server-only read/write via app callbacks; client read returns null.
   * Adapter id: `serverFn`.
   */
  static create(opts: ServerFnOptions): PersistAdapter {
    return {
      id: "serverFn",
      read(ctx: PersistRunContext): Promisable<Locale | null> {
        if (ctx.runtime !== "server") {
          return null;
        }

        return opts.read(ctx);
      },
      async write(locale: Locale, ctx: PersistRunContext): Promise<void> {
        await opts.write(locale, ctx);
      },
    };
  }
}

/**
 * Persist adapter — server read/write via app callbacks ({@link ServerFnOptions}).
 */
export const serverFn = ServerFnAdapter.create;
