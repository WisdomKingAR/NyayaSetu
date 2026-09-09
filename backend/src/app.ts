import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { apiRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { healthRouter } from './features/health/health.router';
import { documentsRouter } from './features/documents/documents.router';

/**
 * Express app factory.
 * Exported separately from server.ts so it can be imported in tests
 * without starting an HTTP listener.
 */
export function createApp() {
  const app = express();

  // --- Security headers (applied globally, before any routes) ---
  app.use(helmet());

  // --- CORS: restricted to the exact Vercel frontend URL ---
  // Do NOT use origin: '*' — this would expose the API to any origin.
  app.use(
    cors({
      origin: config.cors.frontendUrl,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
    }),
  );

  // --- Body parsing ---
  app.use(express.json({ limit: '1mb' }));

  // --- Request logging (dev debugging) ---
  app.use(requestLogger);

  // --- Health route: mounted BEFORE the rate limiter ---
  // UptimeRobot pings /health every 5 min to keep Render warm.
  // It cannot send API keys or auth headers, so this must be unrestricted.
  app.use('/health', healthRouter);

  // --- Rate limiter: applied only to /api/* ---
  app.use('/api', apiRateLimiter);

  // --- Feature routers ---
  app.use('/api/documents', documentsRouter);

  // --- Global error handler: MUST be last ---
  app.use(errorHandler);

  return app;
}
