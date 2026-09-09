import { supabaseAdmin } from '../../lib/supabaseAdmin';
import type {
  AuthSession,
  AuthUser,
  SignInInput,
  SignUpInput,
  UserRole,
} from './auth.types';

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Normalizes Supabase User object into domain AuthUser entity.
 */
function toAuthUser(user: {
  id: string;
  email?: string;
  created_at: string;
  user_metadata?: Record<string, unknown>;
}): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    fullName: (user.user_metadata?.full_name as string) || undefined,
    role: (user.user_metadata?.role as UserRole) || 'citizen',
    createdAt: user.created_at,
  };
}

export const authService = {
  /**
   * Registers a new user and returns active session tokens.
   * Uses admin.createUser with email_confirm: true for friction-free hackathon onboarding.
   */
  async signUp(input: SignUpInput): Promise<AuthSession> {
    const role: UserRole = input.role || 'citizen';
    const metadata: Record<string, unknown> = {
      full_name: input.fullName,
      role,
    };

    // 1. Create user with pre-confirmed email via Supabase Admin API
    const { data: userData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
        user_metadata: metadata,
      });

    if (createError) {
      if (createError.message.toLowerCase().includes('already registered')) {
        throw new AuthenticationError('An account with this email address already exists.');
      }
      throw new Error(`Failed to create account: ${createError.message}`);
    }

    if (!userData.user) {
      throw new Error('User creation returned empty user entity.');
    }

    // 2. Generate session tokens via password sign-in
    const { data: sessionData, error: signInError } =
      await supabaseAdmin.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

    if (signInError || !sessionData.session) {
      // Fallback: return session with user profile if signin session generation is delayed
      return {
        accessToken: '',
        tokenType: 'bearer',
        user: toAuthUser(userData.user),
      };
    }

    return {
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token,
      expiresIn: sessionData.session.expires_in,
      tokenType: sessionData.session.token_type,
      user: toAuthUser(sessionData.user),
    };
  },

  /**
   * Signs in an existing user with email and password.
   */
  async signIn(input: SignInInput): Promise<AuthSession> {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error || !data.session || !data.user) {
      throw new AuthenticationError('Invalid email or password.');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
      tokenType: data.session.token_type,
      user: toAuthUser(data.user),
    };
  },

  /**
   * Refreshes an expired access token using a valid refresh token.
   */
  async refreshSession(refreshToken: string): Promise<AuthSession> {
    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session || !data.user) {
      throw new AuthenticationError('Invalid or expired refresh token. Please sign in again.');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
      tokenType: data.session.token_type,
      user: toAuthUser(data.user),
    };
  },

  /**
   * Retrieves and verifies the authenticated user from a JWT Bearer token.
   */
  async getUserFromToken(token: string): Promise<AuthUser> {
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      throw new AuthenticationError('Invalid or expired authentication token.');
    }

    return toAuthUser(data.user);
  },

  /**
   * Signs out a user by invalidating the session JWT.
   */
  async signOut(token?: string): Promise<void> {
    if (token) {
      try {
        await supabaseAdmin.auth.admin.signOut(token);
      } catch {
        // Silent catch: even if token was already expired, treat signout as complete
      }
    }
  },
};
