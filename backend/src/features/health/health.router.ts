import { Router } from 'express';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export const healthRouter = Router();

/**
 * GET and HEAD /health (also aliased at /api/health)
 *
 * Dual purpose:
 * 1. Ops liveness probe - confirms the Express process is running
 * 2. UptimeRobot keep-alive target - pings every 5 min to prevent
 *    Render free-tier 15-minute idle spin-down
 *
 * CRITICAL:
 * - No authentication middleware must be placed in front of this.
 * - Always returns HTTP 200 to prevent Render zero-downtime deploy failures
 *   or container restart loops during cold starts or transient DB blips.
 * - DB health status is reported in the response body ("database": "ok" | "degraded").
 */
healthRouter.all('/', async (_req, res) => {
  let dbStatus: 'ok' | 'degraded' = 'ok';

  try {
    const dbCheckPromise = supabaseAdmin
      .from('documents')
      .select('id')
      .limit(1);

    const timeoutPromise = new Promise<{ error: unknown }>((_, reject) =>
      setTimeout(() => reject(new Error('Database health check timed out')), 3000),
    );

    const result = (await Promise.race([dbCheckPromise, timeoutPromise])) as {
      error: unknown;
    };
    if (result && result.error) {
      dbStatus = 'degraded';
    }
  } catch {
    dbStatus = 'degraded';
  }

  res
    .status(200)
    .set('Cache-Control', 'no-cache, no-store, must-revalidate')
    .json({
      status: 'ok',
      database: dbStatus,
      timestamp: new Date().toISOString(),
    });
});