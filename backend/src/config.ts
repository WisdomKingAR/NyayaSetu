import 'dotenv/config';

/**
 * Reads a required environment variable and throws at startup if missing.
 * This ensures we catch configuration problems immediately, not mid-request.
 */
function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`[config] Missing required environment variable: ${key}`);
  }
  return val;
}

/**
 * Validates that the service role key is not mistakenly set to the public anon key.
 * If an anon key is used, Postgres RLS will reject server-side operations.
 */
/**
 * Validates that the service role key is not mistakenly set to the public anon key.
 * Throws at startup with a clear message rather than silently falling back,
 * so misconfiguration is never hidden.
 */
function validateServiceRoleKey(key: string): string {
  try {
    const parts = key.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
      if (payload.role === 'anon') {
        throw new Error(
          '[config] SUPABASE_SERVICE_ROLE_KEY is set to the public anon key. ' +
          'Row-Level Security will block all server-side DB operations. ' +
          'Set the secret service_role key in your environment variables.',
        );
      }
    }
  } catch (err) {
    // Re-throw config errors; ignore JWT parse failures for non-JWT formats
    if (err instanceof Error && err.message.startsWith('[config]')) throw err;
  }
  return key;
}

/**
 * Centralized, validated configuration.
 * All process.env access goes through this object - never scattered across files.
 */
export const config = {
  port: parseInt(process.env.PORT ?? '10000', 10),

  supabase: {
    url: requireEnv('SUPABASE_URL'),
    serviceRoleKey: validateServiceRoleKey(requireEnv('SUPABASE_SERVICE_ROLE_KEY')),
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  sarvam: {
    apiKey: requireEnv('SARVAM_API_KEY'),
    baseUrl: process.env.SARVAM_BASE_URL || 'https://api.sarvam.ai',
  },

  gemini: {
    apiKey: requireEnv('GEMINI_API_KEY'),
    // Default to gemini-2.0-flash — a real, stable, fast model.
    // Override via GEMINI_MODEL env var if needed.
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  },

  cors: {
    frontendUrl: (process.env.FRONTEND_URL || 'http://localhost:3000').trim().replace(/\/+$/, ''),
    allowedOrigins: [
      ...new Set([
        'http://localhost:3000',
        'https://nyaya-setu-amber.vercel.app',
        ...(process.env.FRONTEND_URL || '')
          .split(',')
          .map((u) => u.trim().replace(/\/+$/, ''))
          .filter(Boolean),
      ]),
    ],
  },
} as const;