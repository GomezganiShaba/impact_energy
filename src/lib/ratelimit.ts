import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory store for when Upstash env vars are not set
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

function inMemoryRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const entry = inMemoryStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    inMemoryStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, limit, remaining: 0, reset: entry.resetAt };
  }

  entry.count++;
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetAt,
  };
}

let upstashRatelimit: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  upstashRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
    prefix: "ies:rl",
  });
}

export async function rateLimit(
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === "development") {
    return { success: true, limit: 999, remaining: 998, reset: Date.now() + 3600000 };
  }

  if (upstashRatelimit) {
    const result = await upstashRatelimit.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }
  // Fallback: 20 requests per hour per identifier
  return inMemoryRateLimit(identifier, 20, 60 * 60 * 1000);
}

