import { RateLimiterMemory } from "rate-limiter-flexible";

const SEARCH_POINTS = 30;
const SEARCH_DURATION_SEC = 60;

const searchLimiter = new RateLimiterMemory({
  points: SEARCH_POINTS,
  duration: SEARCH_DURATION_SEC,
});

export function getSearchClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function consumeSearchRateLimit(request: Request) {
  try {
    await searchLimiter.consume(getSearchClientIp(request));
    return { allowed: true as const };
  } catch (error) {
    if (error && typeof error === "object" && "msBeforeNext" in error) {
      return {
        allowed: false as const,
        retryAfterMs: (error as { msBeforeNext: number }).msBeforeNext,
      };
    }
    throw error;
  }
}
