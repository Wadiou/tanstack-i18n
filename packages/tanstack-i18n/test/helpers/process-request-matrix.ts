import { acceptLanguage, cookie } from "../../src/adapters/index.js";
import { defineLocaleConfig } from "../../src/config/define-locale.js";
import { DEFAULT_DETECTED_LOCALE_HEADER } from "../../src/constants.js";
import { createLocaleRuntime } from "../../src/create-locale-runtime.js";
import { ProcessRequest } from "../../src/server/process-request.js";
import type { InferMatchContext, LocaleConfig } from "../../src/types.js";
import {
  BASE_URL,
  type PrefixMode,
  type ProcessRequestScenario,
} from "../fixtures/process-request-matrix.js";
import { ignoredPathsRegex } from "./mock-adapters.js";

function buildFirstVisitOverrides(scenario: ProcessRequestScenario) {
  if (scenario.firstVisitOverride !== "auth") {
    return [];
  }

  return [
    {
      target: "firstVisit" as const,
      match: ({ pathname }: InferMatchContext) => pathname.startsWith("/auth"),
      firstVisit: {
        mode: "detect" as const,
        ...(scenario.firstVisitCustomHeader
          ? { detectedLocaleHeader: scenario.firstVisitCustomHeader }
          : {}),
      },
    },
  ];
}

function buildInferEmptyOnAuthOverride() {
  return [
    {
      target: "infer" as const,
      match: ({ pathname }: InferMatchContext) => pathname.startsWith("/auth"),
      infer: [],
    },
  ];
}

export function buildLocaleConfig(prefix: PrefixMode): LocaleConfig {
  return defineLocaleConfig({
    locales: ["en", "ar"] as const,
    defaultLocale: "en" as const,
    url: {
      prefix,
      ignoredPaths: ignoredPathsRegex,
    },
    firstVisit: {
      mode: "redirect",
      detectedLocaleHeader: DEFAULT_DETECTED_LOCALE_HEADER,
    },
    adapters: {
      persist: [cookie({ name: "LOCALE" })],
      infer: [acceptLanguage()],
    },
  });
}

export function buildLocaleConfigForScenario(
  scenario: ProcessRequestScenario
): LocaleConfig {
  const base = buildLocaleConfig(scenario.prefix);
  const firstVisitOverrides = buildFirstVisitOverrides(scenario);
  const inferEmptyOverrides = scenario.overrideInferEmptyOnAuth
    ? buildInferEmptyOnAuthOverride()
    : [];
  const overrides = [...firstVisitOverrides, ...inferEmptyOverrides];

  const firstVisit =
    scenario.firstVisitOverride === "global"
      ? Object.freeze({
          ...base.firstVisit,
          mode: "detect" as const,
        })
      : base.firstVisit;

  if (overrides.length === 0 && firstVisit === base.firstVisit) {
    return base;
  }

  return defineLocaleConfig({
    locales: base.locales,
    defaultLocale: base.defaultLocale,
    url: base.url,
    firstVisit,
    adapters: {
      persist: base.persist,
      infer: base.infer,
      overrides,
    },
  });
}

export function buildRequest(scenario: ProcessRequestScenario): Request {
  const headers = new Headers();
  if (scenario.request.cookie) {
    headers.set("cookie", scenario.request.cookie);
  }
  if (scenario.request.acceptLanguage) {
    headers.set("accept-language", scenario.request.acceptLanguage);
  }
  return new Request(`${BASE_URL}${scenario.request.pathname}`, {
    method: scenario.request.method ?? "GET",
    headers,
  });
}

export function buildRuntimeForScenario(scenario: ProcessRequestScenario) {
  return createLocaleRuntime(buildLocaleConfigForScenario(scenario));
}

export function buildProcessRequestForScenario(
  scenario: ProcessRequestScenario
) {
  return ProcessRequest.createBound(buildLocaleConfigForScenario(scenario));
}
