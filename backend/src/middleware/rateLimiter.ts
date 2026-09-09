import rateLimit from 'express-rate-limit';
import type { ApiResponse } from '../types';

/**
 * IP-based rate limiter applied to general /api/* routes.
 * /health is mounted before this limiter so UptimeRobot is never blocked.
 *
 * Limits: 100 requests per 15 minutes per IP.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests from this IP. Please try again in 15 minutes.',
    },
  } satisfies ApiResponse,
});

/**
 * Stricter rate limiter for sensitive authentication endpoints (/api/auth/*).
 * Protects against brute-force password guessing and credential stuffing.
 *
 * Limits: 15 requests per 15 minutes per IP.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMITED',
      message: 'Too many authentication attempts from this IP. Please try again in 15 minutes.',
    },
  } satisfies ApiResponse,
});
