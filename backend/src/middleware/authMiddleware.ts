import type { Request, Response, NextFunction } from 'express';
import { authService, AuthenticationError } from '../features/auth/auth.service';
import type { AuthUser } from '../features/auth/auth.types';
import type { ApiResponse } from '../types';

// Augment Express Request interface with user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Extracts Bearer token from the Authorization header.
 */
function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1].trim();
  }
  return null;
}

/**
 * Middleware: Strictly requires a valid JWT Bearer token.
 * Rejects with 401 if missing or invalid.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = extractBearerToken(req);

  if (!token) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Please provide a Bearer token in the Authorization header.',
      },
    };
    res.status(401).json(response);
    return;
  }

  try {
    const user = await authService.getUserFromToken(token);
    req.user = user;
    next();
  } catch (err) {
    const message =
      err instanceof AuthenticationError
        ? err.message
        : 'Session expired or invalid token.';

    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message,
      },
    };
    res.status(401).json(response);
  }
}

/**
 * Middleware: Optionally extracts user from Bearer token if present.
 * Does not block if no token is provided (useful for endpoints supporting both guests & members).
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = extractBearerToken(req);

  if (token) {
    try {
      const user = await authService.getUserFromToken(token);
      req.user = user;
    } catch {
      // Ignore token errors for optional auth — treat as guest
      req.user = undefined;
    }
  } else {
    req.user = undefined;
  }

  next();
}
