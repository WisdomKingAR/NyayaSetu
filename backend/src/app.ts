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

  // --- CORS: dynamic validator with trailing-slash normalization and Vercel preview support ---
  app.use(
    cors({
      origin: (requestOrigin, callback) => {
        // Non-browser requests (curl, server-to-server, Render health probe) have no Origin header
        if (!requestOrigin) return callback(null, true);
        const normalized = requestOrigin.replace(/\/+$/, '');
        const isAllowed =
          config.cors.allowedOrigins.includes(normalized) ||
          /^https:\/\/[a-z0-9-]+(?:-[a-z0-9]+)*\.vercel\.app$/.test(normalized);
        if (isAllowed) {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${requestOrigin}`), false);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  // --- Body parsing (1MB limit prevents JSON payload DOS; bypassed for file uploads) ---
  app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.startsWith('multipart/form-data') || req.path.includes('/upload')) {
      return next();
    }
    express.json({ limit: '1mb' })(req, res, next);
  });

  // --- Request logging (dev debugging) ---
  app.use(requestLogger);

  // --- Health route: mounted BEFORE the rate limiter ---
  // UptimeRobot pings /health every 5 min to keep Render warm.
  app.use('/health', healthRouter);
  app.use('/api/health', healthRouter);

  // --- Rate limiter: applied to all /api/* routes ---
  app.use('/api', apiRateLimiter);

  // --- Feature routers ---
  app.use('/api/auth', authRouter);
  app.use('/api/documents', documentsRouter);

  // --- Global error handler: MUST be last ---
  app.use(errorHandler);

  return app;
}
