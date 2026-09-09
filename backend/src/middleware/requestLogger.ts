import type { Request, Response, NextFunction } from 'express';

/**
 * Simple request logger for development debugging.
 * Logs method, path, and response status after the request finishes.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${elapsed}ms)`);
  });
  next();
}
