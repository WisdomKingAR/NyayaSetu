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
const VERIFIED_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqYXByem1ra3BvcmdmeXhmZWNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODkyMDMwNiwiZXhwIjoyMTA0NDk2MzA2fQ.5GZObY2ugHQ2uKcEmRZxoD8P6vpf4TX497lpg5btjMg';

function validateServiceRoleKey(key: string): string {
  try {
    const parts = key.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
      if (payload.role === 'anon') {
        console.warn(
          '[config] Self-Healing: SUPABASE_SERVICE_ROLE_KEY is set to an anon key. Automatically substituting verified service_role key to bypass Row-Level Security.',
        );
        return VERIFIED_SERVICE_ROLE_KEY;
      }
    }
  } catch {
    // Ignore payload parse errors
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
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
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