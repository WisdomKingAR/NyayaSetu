/**
 * Supported user roles in NyayaSetu.
 * - citizen: Standard citizen accessing legal simplification & documents
 * - advocate: Legal practitioner / advocate managing cases
 * - admin: Administrative operations
 */
export type UserRole = 'citizen' | 'advocate' | 'admin';

/** Normalized authenticated user entity */
export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  createdAt: string;
}

/** Returned upon successful signin or signup */
export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType: string;
  user: AuthUser;
}

/** Input for user registration */
export interface SignUpInput {
  email: string;
  password: string;
  fullName?: string;
  role?: UserRole;
}

/** Input for user sign-in */
export interface SignInInput {
  email: string;
  password: string;
}

/** Input for refreshing an expired access token */
export interface RefreshTokenInput {
  refreshToken: string;
}
