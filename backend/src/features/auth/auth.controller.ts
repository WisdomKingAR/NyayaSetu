import type { Request, Response, NextFunction } from 'express';
import { authService, AuthenticationError } from './auth.service';
import type { UserRole } from './auth.types';
import type { ApiResponse } from '../../types';

// RFC 5322 compliant simplified email validator
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const ALLOWED_ROLES = new Set<UserRole>(['citizen', 'advocate', 'admin']);

/**
 * Checks for unexpected fields in request body to prevent parameter injection.
 */
function validateAllowedKeys(body: Record<string, unknown>, allowedKeys: string[]): string | null {
  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(body)) {
    if (!allowed.has(key)) {
      return `Unexpected parameter: "${key}" is not permitted.`;
    }
  }
  return null;
}

export const authController = {
  /**
   * POST /api/auth/signup
   * Register a new user and generate immediate session.
   */
  async handleSignUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = (req.body ?? {}) as Record<string, unknown>;

      const unexpectedError = validateAllowedKeys(body, ['email', 'password', 'fullName', 'role']);
      if (unexpectedError) {
        res.status(400).json({
          success: false,
          error: { code: 'UNEXPECTED_FIELD', message: unexpectedError },
        });
        return;
      }

      const { email, password, fullName, role } = body;

      // Email validation
      if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()) || email.trim().length > 255) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Please provide a valid email address (max 255 characters).',
          },
        });
        return;
      }

      // Password validation (8 to 72 characters)
      if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PASSWORD',
            message: 'Password must be between 8 and 72 characters long.',
          },
        });
        return;
      }

      // Full name validation
      let sanitizedFullName: string | undefined;
      if (fullName !== undefined) {
        if (typeof fullName !== 'string' || fullName.trim().length > 100) {
          res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_NAME',
              message: 'Full name must be a string up to 100 characters.',
            },
          });
          return;
        }
        sanitizedFullName = fullName.trim();
      }

      // Role validation
      let parsedRole: UserRole = 'citizen';
      if (role !== undefined) {
        if (typeof role !== 'string' || !ALLOWED_ROLES.has(role as UserRole)) {
          res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_ROLE',
              message: 'Role must be either "citizen" or "advocate".',
            },
          });
          return;
        }
        parsedRole = role as UserRole;
      }

      const session = await authService.signUp({
        email: email.trim().toLowerCase(),
        password,
        fullName: sanitizedFullName,
        role: parsedRole,
      });

      const response: ApiResponse<typeof session> = {
        success: true,
        data: session,
      };
      res.status(201).json(response);
    } catch (err) {
      if (err instanceof AuthenticationError) {
        res.status(409).json({
          success: false,
          error: { code: 'SIGNUP_FAILED', message: err.message },
        });
        return;
      }
      next(err);
    }
  },

  /**
   * POST /api/auth/signin
   * Authenticate user credentials and return active JWT session.
   */
  async handleSignIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = (req.body ?? {}) as Record<string, unknown>;

      const unexpectedError = validateAllowedKeys(body, ['email', 'password']);
      if (unexpectedError) {
        res.status(400).json({
          success: false,
          error: { code: 'UNEXPECTED_FIELD', message: unexpectedError },
        });
        return;
      }

      const { email, password } = body;

      if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password format.',
          },
        });
        return;
      }

      if (typeof password !== 'string' || !password) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Password is required.',
          },
        });
        return;
      }

      const session = await authService.signIn({
        email: email.trim().toLowerCase(),
        password,
      });

      const response: ApiResponse<typeof session> = {
        success: true,
        data: session,
      };
      res.json(response);
    } catch (err) {
      if (err instanceof AuthenticationError) {
        // Generic response prevents username enumeration attacks
        res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: err.message },
        });
        return;
      }
      next(err);
    }
  },

  /**
   * POST /api/auth/refresh
   * Exchange refresh token for fresh access token.
   */
  async handleRefresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = (req.body ?? {}) as Record<string, unknown>;

      const unexpectedError = validateAllowedKeys(body, ['refreshToken']);
      if (unexpectedError) {
        res.status(400).json({
          success: false,
          error: { code: 'UNEXPECTED_FIELD', message: unexpectedError },
        });
        return;
      }

      const { refreshToken } = body;
      if (typeof refreshToken !== 'string' || !refreshToken.trim()) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'A non-empty refreshToken is required.',
          },
        });
        return;
      }

      const session = await authService.refreshSession(refreshToken.trim());
      const response: ApiResponse<typeof session> = {
        success: true,
        data: session,
      };
      res.json(response);
    } catch (err) {
      if (err instanceof AuthenticationError) {
        res.status(401).json({
          success: false,
          error: { code: 'REFRESH_FAILED', message: err.message },
        });
        return;
      }
      next(err);
    }
  },

  /**
   * GET /api/auth/me
   * Get current authenticated user profile.
   */
  async handleGetMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
      return;
    }

    const response: ApiResponse<{ user: typeof req.user }> = {
      success: true,
      data: { user: req.user },
    };
    res.json(response);
  },

  /**
   * POST /api/auth/signout
   * Terminate active user session.
   */
  async handleSignOut(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : undefined;

    await authService.signOut(token);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Signed out successfully.' },
    };
    res.json(response);
  },
};
