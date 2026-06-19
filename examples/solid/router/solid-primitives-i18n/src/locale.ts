import { createLocaleRuntime } from "@Wadiou/tanstack-i18n";
import { config } from "./locale-config";

export const locale = createLocaleRuntime(config);

/**
 * Since this is a pure SPA without SSR, we don't need isomorphic fn helpers.
 * We can simply call `locale.getLocale()` to read the active locale from the URL, localStorage, or cookie on the client.
 */
export const getLocale = () => locale.getLocale();
