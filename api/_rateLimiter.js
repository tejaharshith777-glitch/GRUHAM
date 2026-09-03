/**
 * Simple In-Memory Rate Limiter for Serverless API Endpoints
 * Prevents runaway API costs by limiting generations per IP/Session.
 */

const rateLimitMap = new Map();
const MAX_REQUESTS_PER_HOUR = 20;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function checkRateLimit(req) {
  const clientIp =
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "client-default";

  const now = Date.now();
  const userRecord = rateLimitMap.get(clientIp) || { count: 0, resetTime: now + WINDOW_MS };

  if (now > userRecord.resetTime) {
    userRecord.count = 1;
    userRecord.resetTime = now + WINDOW_MS;
  } else {
    userRecord.count += 1;
  }

  rateLimitMap.set(clientIp, userRecord);

  if (userRecord.count > MAX_REQUESTS_PER_HOUR) {
    return {
      exceeded: true,
      retryAfterSeconds: Math.ceil((userRecord.resetTime - now) / 1000),
      message: `Rate limit reached: Maximum ${MAX_REQUESTS_PER_HOUR} image generations per hour. Please try again later.`,
    };
  }

  return { exceeded: false, remaining: MAX_REQUESTS_PER_HOUR - userRecord.count };
}
