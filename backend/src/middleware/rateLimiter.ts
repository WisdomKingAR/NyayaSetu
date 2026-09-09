import rateLimit from 'express-rate-limit';
import type { ApiResponse } from '../types';

/**
 * IP-based rate limiter applied to all /api/* routes.
 * /health is mounted before this limiter so UptimeRobot is never blocked.
 *
 * Limits: 100 requests per 15 minutes per IP.
 * Returns a 429 with a standard ApiResponse error envelope on breach.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,   // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,     // Disable X-RateLimit-* headers
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests from this IP. Please try again in 15 minutes.',
    },
  } satisfies ApiResponse,
});
