/** adapters — persist and infer adapter factories. */

export {
  AcceptLanguageAdapter,
  acceptLanguage,
} from "./accept-language-adapter.js";
export { CookieAdapter, cookie } from "./cookie-adapter.js";
export {
  LocalStorageAdapter,
  localStorage,
} from "./local-storage-adapter.js";
export { ServerFnAdapter, serverFn } from "./server-fn-adapter.js";
export type {
  CookieOptions,
  LocalStorageOptions,
  ServerFnOptions,
  ServerFnRead,
  ServerFnWrite,
} from "./types.js";
