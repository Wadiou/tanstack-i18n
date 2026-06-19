import { createLocaleRuntime } from "../../src/create-locale-runtime.js";
import { ProcessRequest } from "../../src/server/process-request.js";
import type { LocaleRuntime } from "../../src/types.js";
import { asNeededLocaleConfig } from "./mock-adapters.js";

export const FLOW_BASE_URL = "https://example.com";

export function flowLocaleConfig() {
  return asNeededLocaleConfig();
}

export function makeFlowRequest(
  pathname: string,
  init?: { cookie?: string; acceptLanguage?: string; method?: string }
): Request {
  const headers = new Headers();
  if (init?.cookie) {
    headers.set("cookie", init.cookie);
  }
  if (init?.acceptLanguage) {
    headers.set("accept-language", init.acceptLanguage);
  }

  return new Request(`${FLOW_BASE_URL}${pathname}`, {
    method: init?.method ?? "GET",
    headers,
  });
}

export function createFlowRuntime(request: Request): LocaleRuntime {
  const config = flowLocaleConfig();
  const runtime = createLocaleRuntime(config);

  return {
    ...runtime,
    getLocale: (context) => runtime.getLocale(context ?? { request }),
  };
}

export function runProcessRequest(request: Request) {
  return ProcessRequest.createBound(flowLocaleConfig())(request);
}
