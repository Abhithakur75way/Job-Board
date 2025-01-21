import rateLimit from "express-rate-limit";

// General rate limiter for APIs
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter for authentication routes (stricter limits)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
