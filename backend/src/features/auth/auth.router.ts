import { Router } from 'express';
import { authController } from './auth.controller';
import { authRateLimiter } from '../../middleware/rateLimiter';
import { requireAuth } from '../../middleware/authMiddleware';

export const authRouter = Router();

/**
 * POST /api/auth/signup
 * Register a new user account with rate limiting
 */
authRouter.post('/signup', authRateLimiter, authController.handleSignUp);

/**
 * POST /api/auth/signin
 * Login and receive access/refresh tokens
 */
authRouter.post('/signin', authRateLimiter, authController.handleSignIn);

/**
 * POST /api/auth/refresh
 * Refresh session tokens
 */
authRouter.post('/refresh', authRateLimiter, authController.handleRefresh);

/**
 * GET /api/auth/me
 * Protected endpoint returning current user profile
 */
authRouter.get('/me', requireAuth, authController.handleGetMe);

/**
 * POST /api/auth/signout
 * Terminate session
 */
authRouter.post('/signout', authController.handleSignOut);
