import { acceptLanguage, cookie } from "../../src/adapters/index.js";
import { defineLocaleConfig } from "../../src/config/define-locale.js";
import type {
  DefineLocaleInput,
  InferAdapter,
  InferRunContext,
  LocaleConfig,
  PersistAdapter,
  PersistRunContext,
} from "../../src/types.js";

export const ignoredPathsRegex =
  /^\/(?:api|rpc|health|dashboard(?:-test)?|test-ping)(?:\/|$)/;

export const dashboardPathRegex = /^\/dashboard/;

/** No-op persist write for tests. */
export function noopWrite(): Promise<void> {
  return Promise.resolve();
}

export function mockPersist(id: string): PersistAdapter {
  return {
    id,
    read: () => null,
    write: noopWrite,
  };
}

export function mockInfer(id: string): InferAdapter {
  return {
    id,
    read: () => null,
  };
}

export function mockPersistContext(
  overrides: Partial<PersistRunContext> = {}
): PersistRunContext {
  return {
    runtime: "server",
    pathname: "/",
    locales: ["en", "ar"],
    defaultLocale: "en",
    ...overrides,
  };
}

export function mockInferContext(
  overrides: Partial<InferRunContext> = {}
): InferRunContext {
  return {
    request: new Request("https://example.com/"),
    pathname: "/",
    locales: ["en", "ar"],
    defaultLocale: "en",
    ...overrides,
  };
}
export function asNeededLocaleConfig(): LocaleConfig {
  return defineLocaleConfig({
    locales: ["en", "ar"] as const,
    defaultLocale: "en" as const,
    url: {
      prefix: "as-needed" as const,
      ignoredPaths: ignoredPathsRegex,
    },
    adapters: {
      persist: [cookie({ name: "LOCALE" })],
      infer: [acceptLanguage()],
    },
  });
}

export function validDefineLocaleInput(): DefineLocaleInput {
  return {
    locales: ["en", "ar"] as const,
    defaultLocale: "en" as const,
    url: { prefix: "as-needed" as const },
    adapters: {
      persist: [mockPersist("cookie:LOCALE")],
      infer: [mockInfer("accept-language")],
    },
  };
}

export function validLocaleConfig(): LocaleConfig {
  return defineLocaleConfig(validDefineLocaleInput());
}
