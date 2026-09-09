import { Router } from 'express';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export const healthRouter = Router();

/**
 * GET /health
 *
 * Dual purpose:
 * 1. Ops liveness probe — confirms the Express process is running
 * 2. UptimeRobot keep-alive target — pings every 5 min to prevent
 *    Render's free-tier 15-minute idle spin-down
 *
 * CRITICAL: No authentication middleware must be placed in front of this.
 * UptimeRobot's free plan cannot send API keys or auth headers.
 *
 * Performs a lightweight Supabase liveness check (SELECT id LIMIT 1),
 * not a full table scan, to keep this route fast even under load.
 */
healthRouter.get('/', async (_req, res) => {
  let dbStatus: 'ok' | 'error' = 'ok';

  try {
    const { error } = await supabaseAdmin
      .from('documents')
      .select('id')
      .limit(1);

    if (error) dbStatus = 'error';
  } catch {
    dbStatus = 'error';
  }

  const httpStatus = dbStatus === 'ok' ? 200 : 503;

  res.status(httpStatus).json({
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});
