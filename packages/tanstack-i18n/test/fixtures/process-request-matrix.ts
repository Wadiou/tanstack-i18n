/**
 * Machine-readable processRequest scenario matrix.
 * Each row: request inputs + explicit expected outcome (source of truth for tests).
 *
 * Config: locales en/ar, default en, ignoredPaths regex (dashboard, api, …),
 * persist cookie LOCALE, infer acceptLanguage().
 *
 * Groups: A1–A4 ignored, B1–B3 canonical strip, C1–C2 prefixed sync,
 * D1, D3–D11 unprefixed as-needed, E1–E4 always, F1–F3 never,
 * G1–G6 unsupported locale sanitization, H1–H12 firstVisit detect.
 */

export const BASE_URL = "http://localhost:3000";

export type PrefixMode = "as-needed" | "always" | "never";

export interface ScenarioRequest {
  acceptLanguage?: string;
  cookie?: string;
  method?: string;
  pathname: string;
}

export type ExpectedResult =
  | { action: "pass" }
  | {
      action: "redirect";
      redirectUrl: string;
      locale: string;
      status: number;
    }
  | { action: "sync-cookie"; locale: string }
  | {
      action: "detect";
      activeLocale: string;
      detectedLocale: string;
      detectedLocaleHeader: string;
    };

export interface ProcessRequestScenario {
  expected: ExpectedResult;
  firstVisitCustomHeader?: string;
  firstVisitOverride?: "auth" | "global";
  group: string;
  id: string;
  overrideInferEmptyOnAuth?: boolean;
  prefix: PrefixMode;
  request: ScenarioRequest;
}

export const processRequestScenarios: ProcessRequestScenario[] = [
  // --- Group A: ignored ---
  {
    id: "A1",
    group: "ignored",
    prefix: "as-needed",
    request: { pathname: "/dashboard/todos", acceptLanguage: "ar" },
    expected: { action: "pass" },
  },
  {
    id: "A2",
    group: "ignored",
    prefix: "as-needed",
    request: { pathname: "/dashboard/todos", cookie: "LOCALE=ar" },
    expected: { action: "pass" },
  },
  {
    id: "A3",
    group: "ignored",
    prefix: "as-needed",
    request: { pathname: "/api/foo", acceptLanguage: "ar" },
    expected: { action: "pass" },
  },
  {
    id: "A4",
    group: "ignored",
    prefix: "as-needed",
    request: { pathname: "/health", acceptLanguage: "ar" },
    expected: { action: "pass" },
  },

  // --- Group B: canonical strip 301 ---
  {
    id: "B1",
    group: "canonical-strip",
    prefix: "as-needed",
    request: { pathname: "/en/auth" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/auth`,
      locale: "en",
      status: 301,
    },
  },
  {
    id: "B2",
    group: "canonical-strip",
    prefix: "as-needed",
    request: { pathname: "/ar/dashboard/todos" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/dashboard/todos`,
      locale: "ar",
      status: 301,
    },
  },
  {
    id: "B3",
    group: "canonical-strip",
    prefix: "as-needed",
    request: { pathname: "/en" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/`,
      locale: "en",
      status: 301,
    },
  },

  // --- Group C: prefixed URL wins ---
  {
    id: "C1",
    group: "prefixed-sync",
    prefix: "as-needed",
    request: {
      pathname: "/ar/auth",
      acceptLanguage: "en-US,en;q=0.9",
    },
    expected: { action: "sync-cookie", locale: "ar" },
  },
  {
    id: "C2",
    group: "prefixed-sync",
    prefix: "as-needed",
    request: { pathname: "/ar/auth", cookie: "LOCALE=ar" },
    expected: { action: "pass" },
  },

  // --- Group D: unprefixed as-needed ---
  {
    id: "D1",
    group: "unprefixed-as-needed",
    prefix: "as-needed",
    request: { pathname: "/auth", acceptLanguage: "ar" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/ar/auth`,
      locale: "ar",
      status: 307,
    },
  },
  {
    id: "D3",
    group: "unprefixed-as-needed",
    prefix: "as-needed",
    request: {
      pathname: "/auth",
      cookie: "LOCALE=ar",
      acceptLanguage: "ar",
    },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/ar/auth`,
      locale: "ar",
      status: 307,
    },
  },
  {
    id: "D4",
    group: "unprefixed-as-needed",
    prefix: "as-needed",
    request: { pathname: "/auth", cookie: "LOCALE=en" },
    expected: { action: "pass" },
  },
  {
    id: "D5",
    group: "unprefixed-as-needed",
    prefix: "as-needed",
    request: {
      pathname: "/auth",
      cookie: "LOCALE=ar",
      acceptLanguage: "en",
    },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/ar/auth`,
      locale: "ar",
      status: 307,
    },
  },
  {
    id: "D6",
    group: "unprefixed-as-needed",
    prefix: "as-needed",
    request: { pathname: "/auth", acceptLanguage: "en-US,en;q=0.9" },
    expected: { action: "pass" },
  },
  {
    id: "D7",
    group: "unprefixed-as-needed",
    prefix: "as-needed",
    request: { pathname: "/", acceptLanguage: "ar-SA,ar;q=0.9" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/ar`,
      locale: "ar",
      status: 307,
    },
  },
  {
    id: "D8",
    group: "unprefixed-as-needed",
    prefix: "as-needed",
    request: { pathname: "/", cookie: "LOCALE=ar" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/ar`,
      locale: "ar",
      status: 307,
    },
  },
  {
    id: "D9",
    group: "unprefixed-as-needed",
    prefix: "as-needed",
    request: { pathname: "/auth", method: "POST", acceptLanguage: "ar" },
    expected: { action: "pass" },
  },
  {
    id: "D10",
    group: "unprefixed-as-needed",
    prefix: "as-needed",
    request: { pathname: "/auth", method: "POST", cookie: "LOCALE=ar" },
    expected: { action: "pass" },
  },
  {
    id: "D11",
    group: "unprefixed-as-needed",
    prefix: "as-needed",
    overrideInferEmptyOnAuth: true,
    request: { pathname: "/auth", acceptLanguage: "ar" },
    expected: { action: "pass" },
  },

  // --- Group E: unprefixed always ---
  {
    id: "E1",
    group: "unprefixed-always",
    prefix: "always",
    request: { pathname: "/auth", acceptLanguage: "ar" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/ar/auth`,
      locale: "ar",
      status: 307,
    },
  },
  {
    id: "E2",
    group: "unprefixed-always",
    prefix: "always",
    request: { pathname: "/auth", cookie: "LOCALE=ar" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/ar/auth`,
      locale: "ar",
      status: 307,
    },
  },
  {
    id: "E3",
    group: "unprefixed-always",
    prefix: "always",
    request: { pathname: "/auth", acceptLanguage: "en-US,en;q=0.9" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/en/auth`,
      locale: "en",
      status: 307,
    },
  },
  {
    id: "E4",
    group: "unprefixed-always",
    prefix: "always",
    request: { pathname: "/auth", cookie: "LOCALE=en" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/en/auth`,
      locale: "en",
      status: 307,
    },
  },

  // --- Group F: never ---
  {
    id: "F1",
    group: "never",
    prefix: "never",
    request: { pathname: "/auth", cookie: "LOCALE=ar" },
    expected: { action: "pass" },
  },
  {
    id: "F2",
    group: "never",
    prefix: "never",
    request: { pathname: "/auth", acceptLanguage: "ar" },
    expected: { action: "sync-cookie", locale: "ar" },
  },
  {
    id: "F3",
    group: "never",
    prefix: "never",
    request: { pathname: "/ar/auth" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/auth`,
      locale: "ar",
      status: 301,
    },
  },

  // --- Group G: unsupported locale sanitization ---
  {
    id: "G1",
    group: "unsupported-locale",
    prefix: "as-needed",
    request: {
      pathname: "/auth",
      cookie: "LOCALE=de",
      acceptLanguage: "ar",
    },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/ar/auth`,
      locale: "ar",
      status: 307,
    },
  },
  {
    id: "G2",
    group: "unsupported-locale",
    prefix: "as-needed",
    request: {
      pathname: "/auth",
      cookie: "LOCALE=de",
      acceptLanguage: "en-US,en",
    },
    expected: { action: "pass" },
  },
  {
    id: "G3",
    group: "unsupported-locale",
    prefix: "as-needed",
    request: { pathname: "/auth", acceptLanguage: "de-DE,de;q=0.9" },
    expected: { action: "pass" },
  },
  {
    id: "G4",
    group: "unsupported-locale",
    prefix: "as-needed",
    request: { pathname: "/ar/auth", cookie: "LOCALE=de" },
    expected: { action: "sync-cookie", locale: "ar" },
  },
  {
    id: "G5",
    group: "unsupported-locale",
    prefix: "as-needed",
    request: { pathname: "/auth", acceptLanguage: "de;q=0.9,ar;q=0.8" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/ar/auth`,
      locale: "ar",
      status: 307,
    },
  },
  {
    id: "G6",
    group: "unsupported-locale",
    prefix: "as-needed",
    request: { pathname: "/de/auth", acceptLanguage: "en-US,en" },
    expected: { action: "pass" },
  },

  // --- Group H: firstVisit detect ---
  {
    id: "H1",
    group: "first-visit-detect",
    prefix: "as-needed",
    firstVisitOverride: "auth",
    request: { pathname: "/auth", acceptLanguage: "ar" },
    expected: {
      action: "detect",
      activeLocale: "en",
      detectedLocale: "ar",
      detectedLocaleHeader: "X-Locale-Detected",
    },
  },
  {
    id: "H2",
    group: "first-visit-detect",
    prefix: "as-needed",
    firstVisitOverride: "auth",
    request: { pathname: "/auth", acceptLanguage: "en-US,en" },
    expected: { action: "pass" },
  },
  {
    id: "H3",
    group: "first-visit-detect",
    prefix: "as-needed",
    request: { pathname: "/", acceptLanguage: "ar" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/ar`,
      locale: "ar",
      status: 307,
    },
  },
  {
    id: "H4",
    group: "first-visit-detect",
    prefix: "as-needed",
    firstVisitOverride: "auth",
    request: { pathname: "/auth", cookie: "LOCALE=ar", acceptLanguage: "en" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/ar/auth`,
      locale: "ar",
      status: 307,
    },
  },
  {
    id: "H5",
    group: "first-visit-detect",
    prefix: "as-needed",
    firstVisitOverride: "auth",
    firstVisitCustomHeader: "X-Auth-Locale-Hint",
    request: { pathname: "/auth", acceptLanguage: "ar" },
    expected: {
      action: "detect",
      activeLocale: "en",
      detectedLocale: "ar",
      detectedLocaleHeader: "X-Auth-Locale-Hint",
    },
  },
  {
    id: "H6",
    group: "first-visit-detect",
    prefix: "as-needed",
    firstVisitOverride: "global",
    request: { pathname: "/auth", acceptLanguage: "ar" },
    expected: {
      action: "detect",
      activeLocale: "en",
      detectedLocale: "ar",
      detectedLocaleHeader: "X-Locale-Detected",
    },
  },
  {
    id: "H7",
    group: "first-visit-detect",
    prefix: "as-needed",
    firstVisitOverride: "auth",
    request: { pathname: "/pricing", acceptLanguage: "ar" },
    expected: {
      action: "redirect",
      redirectUrl: `${BASE_URL}/ar/pricing`,
      locale: "ar",
      status: 307,
    },
  },
  {
    id: "H8",
    group: "first-visit-detect",
    prefix: "as-needed",
    firstVisitOverride: "global",
    request: { pathname: "/de/auth", acceptLanguage: "ar" },
    expected: {
      action: "detect",
      activeLocale: "en",
      detectedLocale: "ar",
      detectedLocaleHeader: "X-Locale-Detected",
    },
  },
  {
    id: "H9",
    group: "first-visit-detect",
    prefix: "as-needed",
    firstVisitOverride: "auth",
    request: { pathname: "/dashboard/todos", acceptLanguage: "ar" },
    expected: { action: "pass" },
  },
  {
    id: "H10",
    group: "first-visit-detect",
    prefix: "always",
    firstVisitOverride: "auth",
    request: { pathname: "/auth", acceptLanguage: "ar" },
    expected: {
      action: "detect",
      activeLocale: "en",
      detectedLocale: "ar",
      detectedLocaleHeader: "X-Locale-Detected",
    },
  },
  {
    id: "H11",
    group: "first-visit-detect",
    prefix: "never",
    firstVisitOverride: "auth",
    request: { pathname: "/auth", acceptLanguage: "ar" },
    expected: { action: "sync-cookie", locale: "ar" },
  },
  {
    id: "H12",
    group: "first-visit-detect",
    prefix: "as-needed",
    firstVisitOverride: "auth",
    request: { pathname: "/auth", acceptLanguage: "de-DE" },
    expected: { action: "pass" },
  },
];
