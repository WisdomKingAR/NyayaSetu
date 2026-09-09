import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

/**
 * Supabase admin client using the service role key.
 * - Has full DB access, bypasses Row Level Security.
 * - MUST remain server-only. NEVER expose to the frontend.
 * - NEVER use the NEXT_PUBLIC_ prefix for SUPABASE_SERVICE_ROLE_KEY.
 */
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
);
