import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { apiRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { healthRouter } from './features/health/health.router';
import { documentsRouter } from './features/documents/documents.router';
import { authRouter } from './features/auth/auth.router';

/**
 * Express app factory.
 * Exported separately from server.ts so it can be imported in tests
 * without starting an HTTP listener.
 */
export function createApp() {
  const app = express();

  // --- Security headers (applied globally, before any routes) ---
  app.use(helmet());

  // --- CORS: restricted to frontend URL with Authorization & Content-Type allowed ---
  app.use(
    cors({
      origin: config.cors.frontendUrl,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // --- Body parsing (1MB limit prevents JSON payload DOS) ---
  app.use(express.json({ limit: '1mb' }));

  // --- Request logging (dev debugging) ---
  app.use(requestLogger);

  // --- Health route: mounted BEFORE the rate limiter ---
  // UptimeRobot pings /health every 5 min to keep Render warm.
  app.use('/health', healthRouter);

  // --- Rate limiter: applied to all /api/* routes ---
  app.use('/api', apiRateLimiter);

  // --- Feature routers ---
  app.use('/api/auth', authRouter);
  app.use('/api/documents', documentsRouter);

  // --- Global error handler: MUST be last ---
  app.use(errorHandler);

  return app;
}
