import { createFileRoute } from "@tanstack/react-router";
import { createFromSource } from "fumadocs-core/search/server";
import { consumeSearchRateLimit } from "@/lib/search-rate-limit";
import { source } from "@/lib/source";

const server = createFromSource(source, {
  language: "english",
});

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const rateLimit = await consumeSearchRateLimit(request);
        if (!rateLimit.allowed) {
          const retryAfterSec = Math.max(
            1,
            Math.ceil(rateLimit.retryAfterMs / 1000)
          );
          return new Response(
            JSON.stringify({ error: "Too many search requests" }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": String(retryAfterSec),
              },
            }
          );
        }
        return server.GET(request);
      },
    },
  },
});
