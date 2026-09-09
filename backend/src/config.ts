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
 * Centralized, validated configuration.
 * All process.env access goes through this object - never scattered across files.
 */
export const config = {
  port: parseInt(process.env.PORT ?? '10000', 10),

  supabase: {
    url: requireEnv('SUPABASE_URL'),
    serviceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  },

  sarvam: {
    apiKey: requireEnv('SARVAM_API_KEY'),
    baseUrl: process.env.SARVAM_BASE_URL || 'https://api.sarvam.ai',
  },

  gemini: {
    apiKey: requireEnv('GEMINI_API_KEY'),
    // Default to gemini-2.5-flash as confirmed
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  },

  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
} as const;
