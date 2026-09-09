export type UserRole = 'citizen' | 'advocate' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType: string;
  user: AuthUser;
}

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName?: string;
  name?: string;
  role?: string;
}
